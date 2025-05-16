// 表单提交处理
document.addEventListener('DOMContentLoaded', function() {
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                product: document.getElementById('product').value
            };

            // 显示成功提示
            alert('订单提交成功！我们将尽快与您联系。');
            
            // 清空表单
            purchaseForm.reset();
        });
    }

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
                    phoneError.textContent = '请输入有效的电话号码';
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
                    emailError.textContent = '请输入有效的电子邮件地址';
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
            const product = document.getElementById('product').value.trim();
            
            // 前端验证
            let isValid = true;
            
            if (!name) {
                isValid = false;
            }
            
            // 验证电话号码
            if (phoneInput && iti && !phone) {
                const phoneError = document.getElementById('phone-error');
                phoneError.textContent = '请输入电话号码';
                phoneError.classList.add('show');
                isValid = false;
            } else if (phoneInput && iti && !iti.isValidNumber()) {
                const phoneError = document.getElementById('phone-error');
                phoneError.textContent = '请输入有效的电话号码';
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
                    emailError.textContent = '请输入有效的电子邮件地址';
                    emailError.classList.add('show');
                    isValid = false;
                }
            }
            
            if (!product) {
                isValid = false;
            }
            
            if (!isValid) {
                alert('请填写必填字段并确保格式正确');
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

    // 原有的加载博客文章功能
    try {
        loadBlogPosts();
    } catch (error) {
        console.error('加载博客文章时出错:', error);
    }
});

// 应用管理后台保存的设置函数
// 将函数设为全局可访问，以便管理后台可以调用
window.applyAdminSettings = function(forceReload = false) {
    console.log('应用管理后台设置 - 开始'); // 添加调试信息
    // 从localStorage获取保存的设置
    const savedSettings = localStorage.getItem('websiteSettings');
    const savedContactSettings = localStorage.getItem('contactSettings');
    const savedMediaFiles = localStorage.getItem('mediaFiles');
    const lastUpdated = localStorage.getItem('settingsLastUpdated');
    
    // 如果需要强制重新加载内容
    if (forceReload) {
        window.forceReloadBlog = true;
        window.forceReloadMedia = true;
        console.log('设置强制重新加载内容标志');
    }
    
    console.log('设置最后更新时间:', lastUpdated);
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            console.log('应用网站设置:', settings); // 添加调试信息
        } catch (error) {
            console.error('解析网站设置时出错:', error);
            return; // 如果解析失败，退出函数
        }
        
        try {
            const settings = JSON.parse(savedSettings); // 重新解析一次
            
            // 应用基本设置
            if (settings.siteName) {
                document.title = settings.siteName;
                const logoElements = document.querySelectorAll('.logo h1, .footer-logo h2');
                console.log('找到logo元素:', logoElements.length);
                logoElements.forEach(el => {
                    if (el) {
                        el.textContent = settings.siteName;
                        console.log('已更新logo文本为:', settings.siteName);
                    }
                });
            }
        
        // 应用SEO设置
        if (settings.metaDescription) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
                console.log('创建了新的meta description标签');
            }
            metaDescription.content = settings.metaDescription;
            console.log('已更新meta description为:', settings.metaDescription);
        }
        
        if (settings.metaKeywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
                console.log('创建了新的meta keywords标签');
            }
            metaKeywords.content = settings.metaKeywords;
            console.log('已更新meta keywords为:', settings.metaKeywords);
        }
        
        // 应用颜色设置
        if (settings.primaryColor || settings.secondaryColor) {
            let styleElement = document.getElementById('dynamic-styles');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'dynamic-styles';
                document.head.appendChild(styleElement);
                console.log('创建了新的动态样式元素');
            }
            
            let cssRules = '';
            if (settings.primaryColor) {
                cssRules += `
                    .btn-primary, .section-header h2:after, .feature-icon, .step-number {
                        background-color: ${settings.primaryColor};
                    }
                    a, .logo h1, .footer-logo h2 {
                        color: ${settings.primaryColor};
                    }
                `;
                console.log('应用主色调:', settings.primaryColor);
            }
            
            if (settings.secondaryColor) {
                cssRules += `
                    .btn-secondary {
                        background-color: ${settings.secondaryColor};
                    }
                `;
                console.log('应用次要色调:', settings.secondaryColor);
            }
            
            styleElement.textContent = cssRules;
        }
        
        // 应用字体设置
        if (settings.fontFamily) {
            document.body.style.fontFamily = settings.fontFamily;
            console.log('应用字体设置:', settings.fontFamily);
        }
    }
    
    // 应用联系方式设置
    if (savedContactSettings) {
        try {
            const contactSettings = JSON.parse(savedContactSettings);
            console.log('应用联系方式设置:', contactSettings); // 添加调试信息
            
            const contactElements = document.querySelectorAll('.contact-info .info-item');
            console.log('找到联系信息元素:', contactElements.length);
            
            contactElements.forEach(item => {
                const icon = item.querySelector('i');
                if (!icon) return;
                
                if (icon.classList.contains('fa-envelope') && contactSettings.email) {
                    const emailElement = item.querySelector('p');
                    if (emailElement) {
                        emailElement.textContent = contactSettings.email;
                        console.log('已更新邮箱为:', contactSettings.email);
                    }
                } else if (icon.classList.contains('fa-phone') && contactSettings.phone) {
                    const phoneElement = item.querySelector('p');
                    if (phoneElement) {
                        phoneElement.textContent = contactSettings.phone;
                        console.log('已更新电话为:', contactSettings.phone);
                    }
                } else if (icon.classList.contains('fa-map-marker-alt') && contactSettings.address) {
                    const addressElement = item.querySelector('p');
                    if (addressElement) {
                        addressElement.textContent = contactSettings.address;
                        console.log('已更新地址为:', contactSettings.address);
                    }
                }
            });
            
            // 更新社交媒体链接
            const socialLinks = document.querySelectorAll('.social-links a');
            console.log('找到社交媒体链接:', socialLinks.length);
            
            if (socialLinks.length > 0 && contactSettings.facebook) {
                socialLinks[0].href = contactSettings.facebook;
                console.log('已更新Facebook链接为:', contactSettings.facebook);
            }
            if (socialLinks.length > 1 && contactSettings.twitter) {
                socialLinks[1].href = contactSettings.twitter;
                console.log('已更新Twitter链接为:', contactSettings.twitter);
            }
            if (socialLinks.length > 2 && contactSettings.instagram) {
                socialLinks[2].href = contactSettings.instagram;
                console.log('已更新Instagram链接为:', contactSettings.instagram);
            }
            if (socialLinks.length > 3 && contactSettings.linkedin) {
                socialLinks[3].href = contactSettings.linkedin;
                console.log('已更新LinkedIn链接为:', contactSettings.linkedin);
            }
        } catch (error) {
            console.error('应用联系方式设置时出错:', error);
        }
    } else {
        console.log('未找到保存的联系方式设置');
    }
    
    console.log('应用管理后台设置 - 完成');
    
    // 更新T/T支付信息
    updateTTPaymentInfo();
    
    // 加载博客文章（如果在博客页面）
    if (window.location.pathname.includes('blog.html')) {
        loadBlogPosts();
    }
    
    // 加载媒体文件（如果有更新）
    if (window.forceReloadMedia || localStorage.getItem('mediaUpdated') === 'true') {
        loadMediaFiles();
    }
}

// 更新T/T支付信息
function updateTTPaymentInfo() {
    const ttPaymentInfo = document.getElementById('ttPaymentInfo');
    if (ttPaymentInfo) {
        // 确保显示正确的公司账户信息
        ttPaymentInfo.innerHTML = `
            <h4 style="margin-top: 0; color: #333;">T/T Payment Information</h4>
            <p><strong>Company Name:</strong> Shanghai Toex Pet Products Co., Ltd.</p>
            <p><strong>Bank:</strong> Bank of China</p>
            <p><strong>Account Number:</strong> 101014822148226</p>
            <p><strong>Swift Code:</strong> BKCHCNBJ300</p>
            <p><strong>Bank Address:</strong> Shanghai Branch, China</p>
        `;
    }
}

// 加载博客文章
function loadBlogPosts() {
    console.log('加载博客文章'); // 添加调试信息
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.log('未找到博客网格元素，可能不在博客页面');
        return;
    }
    
    // 从localStorage获取博客数据
    const savedBlogs = localStorage.getItem('blogPosts');
    if (!savedBlogs) {
        console.log('没有找到保存的博客文章');
        return;
    }
    
    try {
        const blogPosts = JSON.parse(savedBlogs);
        console.log('找到博客文章:', blogPosts.length);
        
        // 检查是否有博客更新标志
        const blogUpdated = localStorage.getItem('blogUpdated');
        console.log('博客更新状态:', blogUpdated);
        
        // 清除现有的管理员添加的博客卡片
        const existingAdminCards = blogGrid.querySelectorAll('.admin-blog-card');
        if (existingAdminCards.length > 0) {
            console.log('清除现有的管理员添加的博客卡片:', existingAdminCards.length);
            existingAdminCards.forEach(card => card.remove());
        }
        
        // 强制重新加载的条件：
        // 1. 有博客更新标志
        // 2. 强制重新加载标志被设置
        // 3. 没有现有的博客卡片
        if (blogUpdated !== 'true' && existingAdminCards.length > 0 && !window.forceReloadBlog) {
            console.log('博客内容没有更新，无需重新加载');
            return;
        }
        console.log('正在重新加载博客内容...');
        
        // 保留原始的默认博客卡片（如果有）
        const defaultCards = blogGrid.querySelectorAll('.blog-card:not(.admin-blog-card)');
        console.log('保留默认博客卡片数量:', defaultCards.length);
    
    // 添加新的博客卡片
    blogPosts.forEach((blog, index) => {
        try {
            // 创建博客卡片
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card admin-blog-card';
            
            // 格式化日期
            let publishDate = '最近发布';
            if (blog.publishDate) {
                const date = new Date(blog.publishDate);
                publishDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            // 设置图片路径
            let imagePath = '';
            if (blog.imageUrl) {
                // 如果有上传的图片URL
                imagePath = blog.imageUrl;
            } else {
                // 使用默认图片
                imagePath = `images/blog${(index % 4) + 1}.svg`;
            }
            
            // 设置博客卡片内容
            blogCard.innerHTML = `
                <div class="blog-image">
                    <img src="${imagePath}" alt="${blog.blogTitle || '博客文章'}">
                </div>
                <div class="blog-content">
                    <div class="blog-date">
                        <i class="far fa-calendar-alt"></i> ${publishDate}
                    </div>
                    <h3><a href="#">${blog.blogTitle || '无标题文章'}</a></h3>
                    <p>${blog.blogExcerpt || '暂无摘要'}</p>
                    <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            // 将博客卡片添加到网格中
            blogGrid.appendChild(blogCard);
            console.log('已添加博客文章:', blog.blogTitle);
        } catch (error) {
            console.error('添加博客文章时出错:', error, blog);
        }
    });
    
    // 重置博客更新标志
    if (localStorage.getItem('blogUpdated') === 'true') {
        localStorage.setItem('blogUpdated', 'false');
        console.log('已重置博客更新标志');
    }
    
    // 清除强制重新加载标志
    window.forceReloadBlog = false;
    console.log('博客加载完成');
}

// 同步管理后台设置到前端的辅助函数
window.syncAdminSettings = function(forceReload = true) {
    console.log('手动同步管理后台设置');
    // 设置更新标志
    localStorage.setItem('settingsUpdated', 'true');
    
    // 检查是否有博客更新
    if (localStorage.getItem('blogPosts')) {
        localStorage.setItem('blogUpdated', 'true');
        console.log('检测到博客内容更新，设置更新标志');
    }
    
    // 检查是否有媒体文件更新
    if (localStorage.getItem('mediaFiles')) {
        localStorage.setItem('mediaUpdated', 'true');
        console.log('检测到媒体文件更新，设置更新标志');
    }
    
    // 记录最后更新时间
    localStorage.setItem('settingsLastUpdated', new Date().toISOString());
    console.log('更新时间已记录:', new Date().toISOString());
    
    // 强制应用设置
    applyAdminSettings(forceReload);
    return '设置已同步';
};

// 加载媒体文件
function loadMediaFiles() {
    console.log('加载媒体文件'); // 添加调试信息
    
    // 从localStorage获取媒体数据
    const savedMedia = localStorage.getItem('mediaFiles');
    if (!savedMedia) {
        console.log('没有找到保存的媒体文件');
        return;
    }
    
    try {
        const mediaFiles = JSON.parse(savedMedia);
        console.log('找到媒体文件:', mediaFiles.length);
        
        // 更新网站中的媒体文件引用
        // 例如：更新轮播图、产品图片等
        updateCarouselImages(mediaFiles);
        updateProductImages(mediaFiles);
        
        // 清除媒体更新标志
        window.forceReloadMedia = false;
        console.log('媒体文件加载完成');
    } catch (error) {
        console.error('加载媒体文件时出错:', error);
    }
}

// 更新轮播图
function updateCarouselImages(mediaFiles) {
    // 查找轮播图元素
    const carouselItems = document.querySelectorAll('.carousel-item img');
    if (carouselItems.length === 0) {
        console.log('未找到轮播图元素');
        return;
    }
    
    // 筛选出轮播图类型的媒体文件
    const carouselMedia = mediaFiles.filter(media => media.type === 'carousel');
    if (carouselMedia.length === 0) {
        console.log('没有轮播图类型的媒体文件');
        return;
    }
    
    console.log('更新轮播图:', carouselMedia.length);
    
    // 更新轮播图
    carouselItems.forEach((item, index) => {
        if (index < carouselMedia.length && carouselMedia[index].url) {
            item.src = carouselMedia[index].url;
            console.log('已更新轮播图:', index, carouselMedia[index].url);
        }
    });
}

// 更新产品图片
function updateProductImages(mediaFiles) {
    // 查找产品图片元素
    const productImages = document.querySelectorAll('.product-item img, .product-image img');
    if (productImages.length === 0) {
        console.log('未找到产品图片元素');
        return;
    }
    
    // 筛选出产品类型的媒体文件
    const productMedia = mediaFiles.filter(media => media.type === 'product');
    if (productMedia.length === 0) {
        console.log('没有产品类型的媒体文件');
        return;
    }
    
    console.log('更新产品图片:', productMedia.length);
    
    // 更新产品图片
    productImages.forEach((item, index) => {
        if (index < productMedia.length && productMedia[index].url) {
            item.src = productMedia[index].url;
            console.log('已更新产品图片:', index, productMedia[index].url);
        }
    });
}

// 检查是否有内容更新的函数
function checkForContentUpdates() {
    console.log('检查内容更新...');
    
    // 获取上次检查时间
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const now = new Date().toISOString();
    
    // 如果是首次检查或距离上次检查已超过5分钟，则进行检查
    if (!lastCheck || (new Date(now) - new Date(lastCheck)) > 5 * 60 * 1000) {
        console.log('执行定期内容更新检查');
        
        // 检查设置更新
        const lastSettingsUpdate = localStorage.getItem('settingsLastUpdated');
        if (lastSettingsUpdate && (!lastCheck || new Date(lastSettingsUpdate) > new Date(lastCheck))) {
            console.log('检测到设置有更新，设置更新标志');
            localStorage.setItem('settingsUpdated', 'true');
        }
        
        // 检查博客更新
        const lastBlogUpdate = localStorage.getItem('blogLastUpdated');
        if (lastBlogUpdate && (!lastCheck || new Date(lastBlogUpdate) > new Date(lastCheck))) {
            console.log('检测到博客有更新，设置更新标志');
            localStorage.setItem('blogUpdated', 'true');
        }
        
        // 检查媒体文件更新
        const lastMediaUpdate = localStorage.getItem('mediaLastUpdated');
        if (lastMediaUpdate && (!lastCheck || new Date(lastMediaUpdate) > new Date(lastCheck))) {
            console.log('检测到媒体文件有更新，设置更新标志');
            localStorage.setItem('mediaUpdated', 'true');
        }
        
        // 更新最后检查时间
        localStorage.setItem('lastUpdateCheck', now);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有内容更新
    checkForContentUpdates();
    
    // 检查是否有设置更新标志，并应用管理后台保存的设置
    const settingsUpdated = localStorage.getItem('settingsUpdated');
    console.log('设置更新状态:', settingsUpdated);
    
    // 检查是否有博客更新标志
    const blogUpdated = localStorage.getItem('blogUpdated');
    console.log('博客更新状态:', blogUpdated);
    
    // 检查是否有媒体文件更新标志
    const mediaUpdated = localStorage.getItem('mediaUpdated');
    console.log('媒体更新状态:', mediaUpdated);
    
    // 确定是否需要强制重新加载
    const forceReload = settingsUpdated === 'true' || blogUpdated === 'true' || mediaUpdated === 'true';
    
    // 无论如何都应用设置，确保每次页面加载时都应用最新设置
    applyAdminSettings(forceReload);
    
    // 如果有设置更新标志，清除它
    if (settingsUpdated === 'true') {
        console.log('检测到设置已更新，应用新设置');
        localStorage.setItem('settingsUpdated', 'false');
    }
    
    // 如果有媒体更新标志，清除它
    if (mediaUpdated === 'true') {
        console.log('检测到媒体文件已更新，应用新媒体');
        localStorage.setItem('mediaUpdated', 'false');
    }
    
    // 设置定期检查更新（每分钟检查一次）
    setInterval(checkForContentUpdates, 60000);
    
    // 检查当前页面是否为博客页面，并加载博客文章
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('blog.html') || currentPath.includes('/blog.html')) {
        console.log('当前在博客页面，主动加载博客文章');
        // 博客页面不需要再次调用loadBlogPosts，因为applyAdminSettings已经调用了
    }
    
    // 移动菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (mobileMenuBtn) {
        // 创建移动菜单
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-close"><i class="fas fa-times"></i></div>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#features">产品特性</a></li>
                <li><a href="#how-it-works">使用方法</a></li>
                <li><a href="#testimonials">客户评价</a></li>
                <li><a href="#pricing">价格方案</a></li>
                <li><a href="blog.html">博客</a></li>
                <li><a href="#faq">常见问题</a></li>
                <li><a href="https://toexpet.en.alibaba.com/productgrouplist-918274351/licemachine.html" class="btn-primary">立即购买</a></li>
            </ul>
        `;
        body.appendChild(mobileMenu);
        
        // 移动菜单打开按钮
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
        
        // 移动菜单关闭按钮
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        }
        
        // 点击菜单项关闭菜单
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('header nav a, .hero-buttons a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 检查链接是否指向页面内部锚点
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 减去导航栏高度
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 用户指南视频切换功能
    const toggleVideoBtn = document.getElementById('toggle-video');
    const videoContainer = document.getElementById('video-container');
    
    if (toggleVideoBtn && videoContainer) {
        toggleVideoBtn.addEventListener('click', function() {
            videoContainer.classList.toggle('active');
            
            // Change button text
            if (videoContainer.classList.contains('active')) {
                toggleVideoBtn.innerHTML = '<i class="fas fa-times-circle"></i> Close Video';
            } else {
                toggleVideoBtn.innerHTML = '<i class="fas fa-play-circle"></i> Watch Tutorial';
                
                // If video is playing, pause it
                const video = videoContainer.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    }
    
    // 直接支付按钮处理
    const paymentBtn = document.querySelector('.payment-btn');
    
    if (paymentBtn) {
        // 收集表单数据用于跟踪
        paymentBtn.addEventListener('click', function(e) {
            // Ensure purchaseForm is available (it's a const from the outer scope)
            if (!purchaseForm) {
                console.error('Purchase form not found for payment button click!');
                return;
            }

            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const emailField = document.getElementById('email');

            let isValid = true;

            // --- Name Validation ---
            if (nameField) { // Check if the element exists
                if (!nameField.value.trim()) {
                    nameField.style.borderColor = '#e74c3c';
                    showFieldError(nameField, 'Name is required');
                    isValid = false;
                } else {
                    nameField.style.borderColor = '#ddd'; // Reset border if valid
                    removeFieldError(nameField); // Clear previous error message
                }
            } else {
                console.warn('Name field not found for validation.');
            }

            // --- Phone Validation ---
            if (phoneField) { // Check if the element exists
                if (!phoneField.value.trim()) {
                    phoneField.style.borderColor = '#e74c3c';
                    showFieldError(phoneField, 'Phone number is required');
                    isValid = false;
                } else {
                    const phoneRegex = /^\+?(\d{1,4}[\s-.]?)?(\(?\d{1,6}\)?)?([\s\-.]?\d{1,5}){1,4}$/;
                    if (!phoneRegex.test(phoneField.value.trim())) {
                        phoneField.style.borderColor = '#e74c3c';
                        showFieldError(phoneField, 'Invalid phone number');
                        isValid = false;
                    } else {
                        phoneField.style.borderColor = '#ddd'; // Reset border if valid
                        removeFieldError(phoneField); // Clear previous error message
                    }
                }
            } else {
                console.warn('Phone field not found for validation.');
            }

            // --- Email Validation ---
            if (emailField) { // Check if the element exists
                if (!emailField.value.trim()) {
                    emailField.style.borderColor = '#e74c3c';
                    showFieldError(emailField, 'Email is required');
                    isValid = false;
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailField.value.trim())) {
                        emailField.style.borderColor = '#e74c3c';
                        showFieldError(emailField, 'Invalid email address');
                        isValid = false;
                    } else {
                        emailField.style.borderColor = '#ddd'; // Reset border if valid
                        removeFieldError(emailField); // Clear previous error message
                    }
                }
            } else {
                console.warn('Email field not found for validation.');
            }

            if (!isValid) {
                return; // Stop further processing if any validation failed
            }
            
            console.log('Form is valid. Proceeding with payment/order.');
            // 表单处理逻辑... (This comment represents the placeholder for actual submission)
        });
    }
    
    // 表单字段验证（实时验证，提高用户体验）
    if (purchaseForm) {
        // 添加必填字段提示
        const nameField = document.getElementById('name');
        const phoneField = document.getElementById('phone');
        const emailField = document.getElementById('email');
        
        // 姓名验证
        if (nameField) {
            nameField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    // 添加错误提示
                    showFieldError(this, 'Name is required');
                } else {
                    this.style.borderColor = '#ddd';
                    removeFieldError(this);
                }
            });
        }
        
        // 电话号码验证
        if (phoneField) {
            phoneField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    showFieldError(this, 'Phone number is required');
                } else {
                    // 使用更宽松的电话号码验证，支持国际格式
                    const phoneRegex = /^\+?(\d{1,4}[\s\-\.\,]?)?(\(?\d{1,6}\)?)?([\s\-\.\,]?\d{1,5}){1,4}$/;
                    if (!phoneRegex.test(this.value.trim())) {
                        this.style.borderColor = '#e74c3c';
                        showFieldError(this, 'Invalid phone number');
                    } else {
                        this.style.borderColor = '#ddd';
                        removeFieldError(this);
                    }
                }
            });
        }
        
        // 邮箱验证
        if (emailField) {
            emailField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    showFieldError(this, 'Email is required');
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value.trim())) {
                        this.style.borderColor = '#e74c3c';
                        showFieldError(this, 'Invalid email address');
                    } else {
                        this.style.borderColor = '#ddd';
                        removeFieldError(this);
                    }
                }
            });
        }
    }

    // 返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 监听滚动事件，显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 创建图片文件夹占位符
    function createImagePlaceholders() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 保存原始src
            const originalSrc = img.getAttribute('src');
            
            // 设置占位符
            img.classList.add('placeholder');
            
            // 创建一个新图像对象来预加载
            const newImg = new Image();
            newImg.onload = function() {
                // 图像加载完成后，移除占位符类并设置原始src
                img.classList.remove('placeholder');
                img.src = originalSrc;
            };
            
            // 设置一个延迟来模拟加载
            setTimeout(() => {
                newImg.src = originalSrc;
            }, 500);
        });
    }
    
    createImagePlaceholders();
    
    // 产品数量增减功能
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        // 创建增减按钮
        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'quantity-wrapper';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.type = 'button';
        decreaseBtn.className = 'quantity-btn decrease';
        decreaseBtn.innerHTML = '-';
        
        const increaseBtn = document.createElement('button');
        increaseBtn.type = 'button';
        increaseBtn.className = 'quantity-btn increase';
        increaseBtn.innerHTML = '+';
        
        // 插入按钮
        quantityInput.parentNode.insertBefore(decreaseBtn, quantityInput);
        quantityInput.parentNode.appendChild(increaseBtn);
        
        // 添加事件监听
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
    
    // 产品选择更新价格
    const productSelect = document.getElementById('product');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            const priceMatch = selectedOption.match(/¥(\d+)/);
            
            if (priceMatch && priceMatch[1]) {
                const price = priceMatch[1];
                // 这里可以更新显示的价格或进行其他操作
                console.log('选择的产品价格: ¥' + price);
            }
        });
    }
});

// 显示字段错误提示
function showFieldError(field, message) {
    // 移除已有的错误提示
    removeFieldError(field);
    
    // 创建错误提示元素
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // 插入到字段后面
    field.parentNode.appendChild(errorElement);
}

// 移除字段错误提示
function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// 添加模态框样式
document.addEventListener('DOMContentLoaded', function() {
    // 添加模态框样式
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: none;
        }
        
        .modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .success-icon {
            font-size: 48px;
            color: #2ecc71;
            margin-bottom: 30px;
            line-height: 1.5;
            font-family: 'Arial', sans-serif;
        }
        
        .close-modal {
            margin-top: 20px;
        }
        
        .close-x {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .close-x:hover {
            color: #333;
        }
    `;
    document.head.appendChild(styleElement);
});