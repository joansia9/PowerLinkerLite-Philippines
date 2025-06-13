
export default function getLambdaURL() {
    if (window.location.host === "powerlinkerlite.rll.byu.edu")
        return "https://api.powerlinkerlite.rll.byu.edu"
    else if (window.location.host === "powerlinkerlite.rll-dev.byu.edu")
        return "https://api.powerlinkerlite.rll-dev.byu.edu"
    else
        return process.env.REACT_APP_LAMBDA_URL
}
