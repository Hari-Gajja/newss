function updateDetails() {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const currency = document.getElementById('currency').value;
    const amount = document.getElementById('amount').value;
    const months = document.getElementById('months').value;
    const forWhat = document.getElementById('for').value;
    const issuedBy = document.getElementById('issuedBy').value;
    const methodOfPayment = document.getElementById('methodOfPayment').value;

    const formattedDate = formatDate(date);

    const details = `Dear Customer, we have received the amount of ${currency} ${amount} for ${forWhat} on ${formattedDate} ${time} via ${methodOfPayment} from ${from}. Received by ${issuedBy}.`;
    document.getElementById('details').value = details;
}

function setCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    document.getElementById('date').value = date;
    document.getElementById('time').value = time;

    updateDetails();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function redirectToSharePage() {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const from = document.getElementById('from').value;
    const months = document.getElementById('months').value;
    const to = document.getElementById('to').value;
    const currency = document.getElementById('currency').value;
    const amount = document.getElementById('amount').value;
    const forWhat = document.getElementById('for').value;
    const issuedBy = document.getElementById('issuedBy').value;
    const methodOfPayment = document.getElementById('methodOfPayment').value;
    

    const formattedDate = formatDate(date);

    const sharePageContent = `
    <style>
    div{
    font-size:25px;
    margin-top:40px;
    }
    img{
    width:50px;
    height:50px;
    border-radius:5px;
    }
    </style>
        <div class="receipt" id="receipt">
            <h2 style="margin-left:160px;">SR CHITS</h2>
            <h2 style="margin-left:130px;">CASH RECEIPT</h2>
            <p>&nbsp;&nbsp;Date: ${formattedDate}</p>
            <p>&nbsp;&nbsp;Time: ${time}</p>
            <p>&nbsp;&nbsp;From: ${from}</p>
            <p>&nbsp;&nbsp;Currency: ${currency}</p>
            <p>&nbsp;&nbsp;Amount: ${amount}</p>
            <p>&nbsp;&nbsp;Group: ${forWhat}</p>
            <p>&nbsp;&nbsp;Number of months paid ${months}</p>
            <p>&nbsp;&nbsp;To: ${to}</p>
            <p>&nbsp;&nbsp;Received with thanks from <b>${from}</b><br>&nbsp;&nbsp; amount of<b> INR ${amount}.00 </b>for Payment of<br> &nbsp;&nbsp;<b>${forWhat}</b> completed ${months} months on ${formattedDate} at<br>&nbsp;&nbsp; ${time}.</p>
            <p>&nbsp;&nbsp;Method of Payment: ${methodOfPayment}</p>
            <img src="logo.jpg" alt="Logo Here">
            <p>&nbsp;&nbsp;Received By: ${issuedBy}</p>
            <button onclick="printAndSharePage()">Share as PDF on WhatsApp</button>
        </div>
    `;
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head>
            <title>Share Receipt</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        </head>
        <body>
            ${sharePageContent}
            <script>
                ${printAndSharePage.toString()}
            </script>
        </body>
        </html>
    `);
}

function printAndSharePage() {
    window.print();

    const { jsPDF } = window.jspdf;
    const receipt = document.getElementById('receipt');

    const doc = new jsPDF('p', 'mm', 'a2');
    doc.html(receipt, {
        callback: function (doc) {
            const pdfBlob = doc.output('blob');
            const to = document.querySelector('#receipt p:nth-child(9)').textContent.split(': ')[1];

            if (navigator.share) {
                navigator.share({
                    title: `${to}`,
                    text: 'Here is my cash receipt.',
                    files: [new File([pdfBlob], `${to}.pdf`, { type: 'application/pdf' })]
                }).then(() => console.log('Shared successfully'))
                .catch(error => console.log('Sharing failed', error));
            } else {
                alert('Web Share API not supported in this browser.');
            }
        }
    });
}

function shareOnWhatsApp() {
    const details = document.getElementById('details').value;
    const url = `https://wa.me/?text=${encodeURIComponent(details)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', setCurrentDateTime);
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateDetails);
});
