const cssTemp = `
<style> 
    body { 
        font-family: Arial, sans-serif; 
        background-color: #f8f8f8; 
        text-align: center; padding: 50px; 
        } 
    .container { 
        background-color: #fff; 
        padding: 20px; 
        border-radius: 8px; 
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
        } 
    h1 { 
        color: #333;
        } 
    p { 
        color: #666; 
    } 
</style>
`;

const jsTemp = `
<script> 
    setTimeout(() => { window.location.href = '/'; }, 8000); 
</script>
`;

const TemplateGenerator = (orderId, orderStatus, orderAmount) => ` 
<html> 
    <head> <title>Order Status</title> ${cssTemp} </head> 
    <body> 
    <div class="container"> 
        <h1>Order Status</h1> 
        <p>Order Amount: ${orderAmount} INR</p>
        <p>Order ID: ${orderId}</p> 
        <p>Status: ${orderStatus}</p> 
        <p>Redirecting to home page...</p> 
    </div> ${jsTemp} 
    </body> 
</html> 
`;

module.exports =  TemplateGenerator;