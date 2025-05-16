// 表单验证脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化国际电话输入插件
    const phoneInput = document.querySelector("#phone");
    let iti;
    
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            separateDialCode: true,
            autoPlaceholder: "polite",
            preferredCountries: ["cn", "us", "gb"],
            formatOnDisplay: true
        });

        // 添加电话号码格式化和验证
        phoneInput.addEventListener("blur", function() {
            const phoneError = document.getElementById('phone-error');
            
            if (phoneInput.value.trim()) {
                if (iti.isValidNumber()) {
                    // 格式化显示，添加空格以提高可读性
                    phoneInput.value = formatPhoneNumber(iti.getNumber());
                    phoneInput.classList.add('formatted');
                    phoneError.classList.remove('show');
                } else {
                    phoneError.textContent = '请输入有效的国际电话号码格式';
                    phoneError.classList.add('show');
                }
            } else {
                phoneError.classList.remove('show');
            }
        });
    }
    
    // 格式化电话号码函数，添加空格提高可读性
    function formatPhoneNumber(phoneNumber) {
        // 保留国家代码和区号，为本地号码添加空格
        // 例如 +86 138 1234 5678
        return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3");
    }

    // 初始化电子邮件验证
    const emailInput = document.querySelector("#email");
    if (emailInput) {
        emailInput.addEventListener("blur", function() {
            const emailError = document.getElementById('email-error');
            const email = emailInput.value.trim();
            
            if (email) {
                // 使用HTML5内置验证和正则表达式验证Email
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                
                if (emailPattern.test(email)) {
                    emailError.classList.remove('show');
                } else {
                    emailError.textContent = '请输入有效的电子邮件地址格式';
                    emailError.classList.add('show');
                }
            } else {
                emailError.classList.remove('show');
            }
        });
    }

    // 表单提交处理
    const purchaseForm = document.getElementById('purchaseForm');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    
    if (purchaseForm && submitOrderBtn) {
        submitOrderBtn.addEventListener('click', function() {
            // 获取表单数据
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // 前端验证
            let isValid = true;
            
            // 验证姓名
            if (!name) {
                isValid = false;
                alert('请输入姓名');
                return false;
            }
            
            // 验证电话号码
            if (phoneInput && iti && !phone) {
                const phoneError = document.getElementById('phone-error');
                phoneError.textContent = '请输入电话号码';
                phoneError.classList.add('show');
                isValid = false;
            } else if (phoneInput && iti && !iti.isValidNumber()) {
                const phoneError = document.getElementById('phone-error');
                phoneError.textContent = '请输入有效的国际电话号码格式';
                phoneError.classList.add('show');
                isValid = false;
            }
            
            // 验证电子邮件
            if (!email) {
                const emailError = document.getElementById('email-error');
                emailError.textContent = '请输入电子邮件地址';
                emailError.classList.add('show');
                isValid = false;
            } else if (emailInput) {
                const emailError = document.getElementById('email-error');
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                
                if (!emailPattern.test(email)) {
                    emailError.textContent = '请输入有效的电子邮件地址格式';
                    emailError.classList.add('show');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                alert('请填写姓名、电话和邮箱必填字段并确保格式正确');
                return false;
            }

            // 显示成功提示
            document.getElementById('orderSuccessModal').style.display = 'flex';
            
            // 可选: 滚动以使模态框可见
            window.scrollTo({
                top: document.getElementById('orderSuccessModal').offsetTop - 100,
                behavior: 'smooth'
            });
            
            // 清空表单
            purchaseForm.reset();
        });
        
        // 添加事件处理程序关闭模态框
        const closeButton = document.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                document.getElementById('orderSuccessModal').style.display = 'none';
            });
        }
    }
}); 