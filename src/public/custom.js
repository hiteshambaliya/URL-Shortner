function generateShortURL(){
    var longUrl = document.getElementById('longUrl').value;

    fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({longUrl: longUrl})
    }).then( (res)=> res.json() )
    .then( data => {
        let lblError = document.getElementById('lblError');
        if('error' in data){
            lblError.innerHTML = data.error;
            lblError.style.color = 'red';
        } else {
            document.getElementById('longUrl').value = "";
            lblError.innerHTML = 'Short link created successfully. ' + data.shortUrl;
            lblError.style.color = 'green';
            reloadSelf(1000);
        }
    } );
}
function reloadSelf(n){
    setTimeout(() => {
        document.location = document.location;
    }, n);
}