/**
 * Order Success Notification Script
 * This script displays a success notification after the user submits an order
 */

// Execute after the page has loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Order success notification script loaded');
    
    // Check if success modal already exists on the page
    let orderSuccessModal = document.getElementById('orderSuccessModal');
    
    // If it doesn't exist, create one
    if (!orderSuccessModal) {
        console.log('Creating order success modal');
        orderSuccessModal = document.createElement('div');
        orderSuccessModal.id = 'orderSuccessModal';
        orderSuccessModal.className = 'modal';
        orderSuccessModal.style.position = 'fixed';
        orderSuccessModal.style.top = '0';
        orderSuccessModal.style.left = '0';
        orderSuccessModal.style.width = '100%';
        orderSuccessModal.style.height = '100%';
        orderSuccessModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        orderSuccessModal.style.zIndex = '1000';
        orderSuccessModal.style.display = 'none';
        orderSuccessModal.style.justifyContent = 'center';
        orderSuccessModal.style.alignItems = 'center';
        
        // Add modal content
        orderSuccessModal.innerHTML = `
            <div class="modal-content" style="background-color: #fff; border-radius: 5px; padding: 30px; max-width: 500px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: inherit;">
                <div class="success-icon" style="font-size: 60px; color: #3498db; margin-bottom: 20px;"><i class="fas fa-check-circle"></i></div>
                <h3 style="margin-top: 0; color: #333; font-size: 22px; font-weight: 600;">Thank you for your order!</h3>
                <p style="color: #666; margin-bottom: 25px; font-size: 16px;">We will contact you shortly.</p>
                <button class="btn-primary close-modal" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">OK</button>
            </div>
        `;
        
        // Add modal to the page
        document.body.appendChild(orderSuccessModal);
        
        console.log('Order success modal added to page');
    }
    
    // Listen for form submission button
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const purchaseForm = document.getElementById('purchaseForm');
    
    if (submitOrderBtn && purchaseForm) {
        console.log('Found submit order button, adding event listener');
        
        // Add click event to ensure modal displays correctly
        submitOrderBtn.addEventListener('click', function() {
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            const product = document.getElementById('product').value;
            
            // Validate required fields
            if (!name || !phone || !email || !address || !product) {
                console.log('Form validation failed, not showing success message');
                return; // If validation fails, don't show success message
            }
            
            // Slight delay to show success message, ensuring it runs after original code
            setTimeout(function() {
                console.log('Displaying order submission success message');
                orderSuccessModal.style.display = 'flex';
                
                // Add close button event
                const closeBtn = orderSuccessModal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.onclick = function() {
                        orderSuccessModal.style.display = 'none';
                        // Reset form
                        purchaseForm.reset();
                    };
                }
            }, 100);
        });
    }
});