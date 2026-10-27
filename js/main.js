const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const mobileHeader = document.getElementById('mobileHeader');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click vào các liên kết trong Mục lục
    document.querySelectorAll('#toc-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Chặn hành vi nhảy trang đột ngột mặc định

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Thực hiện lướt mượt từ từ đến section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Cập nhật URL thanh địa chỉ mà không làm giật trang
                history.pushState(null, null, targetId);

                // Tự động đóng Menu Sidebar nếu đang dùng trên điện thoại
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                }
            }
        });
    });
});
// Auto-hide Mobile Header on Scroll Down
let lastScrollY = window.pageYOffset;
window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    if (mobileHeader && window.innerWidth < 1024) {
        if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            // Scrolling down -> hide header
            mobileHeader.classList.add('-translate-y-full');
        } else {
            // Scrolling up or at top -> show header
            mobileHeader.classList.remove('-translate-y-full');
        }
    }
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
}, { passive: true });

// Highlight Active Table of Contents Item on Scroll
const sections = document.querySelectorAll('section[id]');
const tocItems = document.querySelectorAll('.toc-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 120)) {
            current = section.getAttribute('id');
        }
    });

    tocItems.forEach(item => {
        item.classList.remove('bg-blue-50', 'text-tac-blue', 'font-bold');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('bg-blue-50', 'text-tac-blue', 'font-bold');
        }
    });
});

// Close sidebar when link clicked on mobile
tocItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================================
// Security & Anti-Copy Protection System
// ========================================================
(function initAntiCopySecurity() {
    let toastTimeout = null;

    // Toast Notification Creator & Trigger
    function showSecurityToast(message) {
        let toast = document.getElementById('securityNoticeToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'securityNoticeToast';
            toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] sm:w-auto bg-slate-900/95 text-white backdrop-blur-md px-5 py-3.5 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3.5 transform transition-all duration-300 -translate-y-16 opacity-0 pointer-events-none';
            toast.innerHTML = `
                <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid fa-shield-halved text-lg"></i>
                </div>
                <div class="text-left text-xs sm:text-sm">
                    <p class="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>Tài liệu nội bộ được bảo vệ</span>
                    </p>
                    <p class="text-slate-300 mt-0.5 text-xs" id="securityNoticeMsg">Nội dung đã được khóa sao chép theo chính sách bảo mật TAC.</p>
                </div>
            `;
            document.body.appendChild(toast);
        }

        if (message) {
            const msgEl = document.getElementById('securityNoticeMsg');
            if (msgEl) msgEl.textContent = message;
        }

        // Display with slide-in animation
        clearTimeout(toastTimeout);
        toast.classList.remove('-translate-y-16', 'opacity-0', 'pointer-events-none');
        toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        toastTimeout = setTimeout(() => {
            toast.classList.add('-translate-y-16', 'opacity-0', 'pointer-events-none');
            toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        }, 2500);
    }

    // 1. Disable Right Click (Context Menu)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSecurityToast('Chuột phải đã bị vô hiệu hóa để bảo vệ bản quyền tài liệu.');
        return false;
    });

    // 2. Disable Copy Event & Clear Clipboard
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        if (e.clipboardData) {
            e.clipboardData.clearData();
        }
        showSecurityToast('Sao chép nội dung đã bị khóa theo chính sách bảo mật nội bộ.');
        return false;
    });

    // 3. Disable Cut Event
    document.addEventListener('cut', (e) => {
        e.preventDefault();
        showSecurityToast('Thao tác cắt nội dung đã bị khóa.');
        return false;
    });

    // 4. Disable Drag and Drop (images, text, links)
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    // 5. Disable Text Selection via selectstart
    document.addEventListener('selectstart', (e) => {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // 6. Block Key Combinations (Ctrl/Cmd + C, A, X, S, P, U and F12/DevTools)
    document.addEventListener('keydown', (e) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        // F12 or Inspect shortcuts (Ctrl+Shift+I / J / C)
        if (e.key === 'F12' || (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))) {
            e.preventDefault();
            showSecurityToast('Công cụ kiểm tra phần tử đã bị hạn chế.');
            return false;
        }

        if (isCtrlOrCmd) {
            // Copy (C), Select All (A), Cut (X)
            if (['c', 'a', 'x'].includes(key)) {
                e.preventDefault();
                showSecurityToast('Phím tắt sao chép / chọn toàn bộ đã bị vô hiệu hóa.');
                return false;
            }
            // Save (S), Print (P), View Source (U)
            if (['s', 'p', 'u'].includes(key)) {
                e.preventDefault();
                showSecurityToast('Thao tác lưu / in ấn / xem mã nguồn đã bị vô hiệu hóa.');
                return false;
            }
        }
    });
})();