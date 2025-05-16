// FAQ折叠功能的独立脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有FAQ项
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.log('没有找到FAQ项');
        return;
    }
    
    console.log('找到', faqItems.length, '个FAQ项');
    
    // 为每个FAQ项添加点击事件
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (!question) {
            console.log('FAQ项中没有找到问题元素');
            return;
        }
        
        question.addEventListener('click', function() {
            console.log('FAQ问题被点击');
            
            // 切换当前FAQ项的激活状态
            item.classList.toggle('active');
            
            // 获取图标元素
            const iconElement = question.querySelector('.faq-toggle i');
            
            if (iconElement) {
                // 根据激活状态更改图标
                if (item.classList.contains('active')) {
                    iconElement.classList.remove('fa-plus');
                    iconElement.classList.add('fa-minus');
                    console.log('FAQ已展开');
                } else {
                    iconElement.classList.remove('fa-minus');
                    iconElement.classList.add('fa-plus');
                    console.log('FAQ已折叠');
                }
            }
        });
    });
    
    console.log('FAQ初始化完成');
}); 