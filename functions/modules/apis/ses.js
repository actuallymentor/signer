const AWS = require( 'aws-sdk' )
const { AWS_SES_FROM_EMAIL, AWS_SES_SECRET_KEY, AWS_SES_REGION, AWS_SES_KEYID } = process.env
const { log } = require( '../helpers' )
const SES_CONFIG = {
    accessKeyId: AWS_SES_KEYID,
    secretAccessKey: AWS_SES_SECRET_KEY,
    region: AWS_SES_REGION,
}
const AWS_SES = new AWS.SES( SES_CONFIG )

// Email templates
const pug = require( 'pug' )
const { promises: fs } = require( 'fs' )
const csso = require( 'csso' )
const juice = require( 'juice' )

async function compile_pug_to_email( pugFile, data ) {

    const [ emailPug, inlineNormalise, styleExtra, styleOutlook, signerStyles ] = await Promise.all( [
        fs.readFile( pugFile ),
        fs.readFile( `${ __dirname }/../templates/css-resets/normalize.css`, 'utf8' ),
        fs.readFile( `${ __dirname }/../templates/css-resets/extra.css`, 'utf8' ),
        fs.readFile( `${ __dirname }/../templates/css-resets/outlook.css`, 'utf8' ),
        fs.readFile( `${ __dirname }/../templates/signer.css`, 'utf8' )
    ] )

    const { css } = csso.minify( [ styleExtra, styleOutlook, inlineNormalise, signerStyles ].join( '\n' ) )
    const html = pug.render( emailPug, { data, headStyles: css } )
    const emailifiedHtml = juice.inlineContent( html, [ inlineNormalise, signerStyles ].join( '\n' ), { removeStyleTags: false } )

    return emailifiedHtml

}

async function send_email( recipient, subject, html, text ) {

    const options = {
        Source: AWS_SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [ recipient ]
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: { Charset: 'UTF-8', Data: html },
                ... text && { Text: { Charset: 'UTF-8', Data: text } }  
            },
            Subject: { Charset: 'UTF-8', Data: subject }
        }
        
    }

    log( `Sending email "${ options.Message.Subject.Data }" from ${ options.Source } to ${ options.Destination.ToAddresses[0] }` )

    return AWS_SES.sendEmail( options ).promise()

}

exports.send_verification_email = async ( auth_token, email, address, ENS ) => {


    const email_data = {
        verification_link: `https://signer.is/#/email/confirm/${ auth_token }`,
        email,
        address,
        ENS: ENS || 'no'
    }
    const email_html = await compile_pug_to_email( `${ __dirname }/../templates/verify.email.pug`, email_data )
    const email_text = ( await fs.readFile( `${ __dirname }/../templates/verify.email.txt`, 'utf8' ) )
        .replace( '%%address%%', email_data.address )
        .replace( '%%ENS%%', email_data.ENS )
        .replace( '%%verification_link%%', email_data.verification_link )

    return send_email( email, `Verify your email address`, email_html, email_text )


}

exports.send_welcome_email = async ( email, address, ENS ) => {


    const email_data = {
        email,
        address,
        ENS: ENS
    }
    const email_html = await compile_pug_to_email( `${ __dirname }/../templates/welcome.email.pug`, email_data )
    const email_text = ( await fs.readFile( `${ __dirname }/../templates/welcome.email.txt`, 'utf8' ) )
        .replace( '%%address%%', email_data.address )
        .replace( '%%email%%', email_data.email )

    return send_email( email, `Email forward confirmed for ${ ENS || address }`, email_html, email_text )


}

exports.send_spam_check_email = async ( email, address, ENS ) => {


    const email_data = {
        email,
        address,
        ENS: ENS
    }
    const email_html = await compile_pug_to_email( `${ __dirname }/../templates/spamcheck.email.pug`, email_data )

    return send_email( email, `Spam check for ${ ENS || address }@signer.is`, email_html )


}