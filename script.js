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
        body {
            font-family: Arial, sans-serif;
            font-size: 25px;
        }
        .receipt {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #000;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            text-align: center;
            margin: 10px 0;
        }
        p {
            margin: 5px 0;
            font-size: 25px;
        }
        img {
            width: 200px;
            height: 200px;
            border-radius: 20px;
            display: block;
            margin: 10px auto;
        }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 20px 0;
            background-color: #007BFF;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .receipt {
                padding: 10px;
            }
            p {
                font-size: 25px;
            }
            button {
                padding: 8px;
            }
        }
    </style>
    <body>
        <div class="receipt" id="receipt">
            <h2>SR CHITS</h2>
            <h2>CASH RECEIPT</h2>
            <p>Date: ${formattedDate}</p>
            <p>Time: ${time}</p>
            <p>From: ${from}</p>
            <p>Currency: ${currency}</p>
            <p>Amount: ${amount}</p>
            <p>Group: ${forWhat}</p>
            <p>Number of months paid: ${months}</p>
            <p>To: ${to}</p>
            <p>Received with thanks from <b>${from}</b><br>amount of <b>INR ${amount}.00</b> for Payment of<br><b>${forWhat}</b> completed ${months} months on ${formattedDate} at<br>${time}.</p>
            <p>Method of Payment: ${methodOfPayment}</p>
            <img src="logo.jpg" alt="Logo Here">
            <p>Received By: ${issuedBy}</p>
            <button id="shareButton">>Share as PDF on WhatsApp</button>
        </div>
    </body>`;

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
                    const printAndSharePage = () => {
                        window.print();
                        const { jsPDF } = window.jspdf;
                        const receipt = document.getElementById('receipt');
                        const doc = new jsPDF('p', 'mm', 'a4');
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
                    };

                    document.getElementById('shareButton').addEventListener('click', printAndSharePage);
                </script>
            </body>
        </html>
    `);
}

