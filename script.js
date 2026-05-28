// 视频播放功能
        function playVideo() {
            const placeholder = document.getElementById('videoPlaceholder');
            const video = document.getElementById('mainVideo');
            
            placeholder.style.display = 'none';
            video.style.display = 'block';
            
            // 这里可以设置您的视频源地址
            // video.src = 'your-video-file.mp4';
            
            video.play().catch(e => {
                console.log('视频播放需要用户交互或视频源未设置');
            });
        }

        // 导航高亮
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + current) {
                    item.classList.add('active');
                }
            });
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // 技能树叶动画 - 滚动到视口时触发进度条动画
        const skillLeaves = document.querySelectorAll('.skill-leaf');
        const leafObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const leaf = entry.target;
                    const progressBar = leaf.querySelector('.leaf-progress-bar');
                    const level = leaf.dataset.level;
                    setTimeout(() => {
                        progressBar.style.width = level + '%';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });

        skillLeaves.forEach(leaf => leafObserver.observe(leaf));


        // Hero视频静音切换功能
        function toggleMute() {
            const video = document.getElementById('mainVideo');
            const muteHint = document.getElementById('muteHint');
            
            if (video) {
                if (video.muted) {
                    video.muted = false;
                    muteHint.classList.add('unmuted');
                    muteHint.innerHTML = '<i class="fas fa-volume-up"></i><span>点击关闭声音</span>';
                } else {
                    video.muted = true;
                    muteHint.classList.remove('unmuted');
                    muteHint.innerHTML = '<i class="fas fa-volume-mute"></i><span>点击开启声音</span>';
                }
            }
        }

        // 证书区域下拉展开/收缩
        function toggleCertifications(header) {
            const panel = header.closest('.certifications-panel');
            panel.classList.toggle('expanded');
        }

        // 作品集滑动函数
        function scrollPortfolio(btn, direction) {
            const carousel = btn.closest('.portfolio-carousel');
            const track = carousel.querySelector('.portfolio-track');
            const cardWidth = carousel.querySelector('.portfolio-card').offsetWidth;
            const gap = 24;
            const scrollAmount = (cardWidth + gap) * direction;
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }

        // 作品集卡片点击事件 - 全部为视频播放
        document.addEventListener('DOMContentLoaded', function() {
            document.addEventListener('click', function(e) {
                const action = e.target.closest('.portfolio-action');
                if (action) {
                    playPortfolioVideo(action);
                }
            });
        });

        // 作品集视频播放功能 - 弹出窗口播放
        let currentPortfolioVideo = null;

        function playPortfolioVideo(overlay) {
            const card = overlay.closest('.app-card, .video-card, .portfolio-card');
            const video = card.querySelector('.portfolio-video');
            const source = video.querySelector('source');
            const videoSrc = source.src;
            const videoTitle = card.querySelector('.portfolio-title, .ae-title, .app-name')?.textContent || '视频播放';

            // 获取模态框元素
            const modal = document.getElementById('videoModal');
            const modalVideo = document.getElementById('modalVideo');
            const modalTitle = document.getElementById('videoModalTitle');

            // 设置视频源
            modalVideo.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
            modalVideo.load();

            // 设置视频标题
            modalTitle.textContent = videoTitle;

            // 确保视频有声音 - 移除muted属性
            modalVideo.muted = false;
            modalVideo.removeAttribute('muted');

            // 显示模态框
            modal.classList.add('active');

            // 播放视频
            modalVideo.play().catch(err => {
                console.log('视频播放失败:', err);
                alert('视频播放失败，请检查视频文件是否存在。');
            });

            // 阻止背景滚动
            document.body.style.overflow = 'hidden';
        }

        function closeVideoModal(event) {
            // 如果有event参数，检查是否应该关闭
            if (event) {
                // 点击的是关闭按钮
                if (event.target.closest('.video-modal-close')) {
                    // 继续执行关闭
                }
                // 点击的是模态框背景（不是内容区域）
                else if (event.target === event.currentTarget) {
                    // 继续执行关闭
                }
                // 点击的是视频或内容区域，不关闭
                else if (event.target.closest('.video-modal-content')) {
                    return;
                }
            }

            const modal = document.getElementById('videoModal');
            const modalVideo = document.getElementById('modalVideo');

            // 暂停视频
            modalVideo.pause();
            modalVideo.currentTime = 0;

            // 隐藏模态框
            modal.classList.remove('active');

            // 恢复背景滚动
            document.body.style.overflow = '';
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('videoModal');
                if (modal.classList.contains('active')) {
                    closeVideoModal();
                }
            }
        });

        // 标签切换时关闭模态框
        function switchTab(tabName) {
            // 关闭视频模态框
            closeVideoModal();
            document.querySelectorAll('.portfolio-tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            document.querySelectorAll('.portfolio-content').forEach(content => content.classList.remove('active'));
            document.getElementById('tab-' + tabName).classList.add('active');

            // 暂停所有视频并重置
            document.querySelectorAll('.portfolio-video').forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
            document.querySelectorAll('.video-play-overlay, .video-overlay').forEach(o => o.classList.remove('playing'));
            document.querySelectorAll('.video-card, .app-card').forEach(c => c.classList.remove('playing'));
        }


        // 荣誉项hover联动照片
        const honorItems = document.querySelectorAll('.honor-item');
        const honorPhotos = document.querySelectorAll('.honor-photo');

        honorItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                honorPhotos.forEach((photo, photoIndex) => {
                    if (photoIndex === index) {
                        photo.style.transform = 'scale(1.1) rotate(3deg)';
                        photo.style.zIndex = '20';
                        photo.style.boxShadow = '0 12px 30px rgba(0,191,165,0.3)';
                    } else {
                        photo.style.opacity = '0.5';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                honorPhotos.forEach(photo => {
                    photo.style.transform = '';
                    photo.style.zIndex = '';
                    photo.style.boxShadow = '';
                    photo.style.opacity = '1';
                });
            });
        });

        // 滚动动画
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.content-card').forEach(card => observer.observe(card));

        // 技能树分支展开/收起
        document.querySelectorAll('.branch-node').forEach(node => {
            node.addEventListener('click', function() {
                const leaves = this.nextElementSibling;
                if (leaves.style.maxHeight && leaves.style.maxHeight !== '0px') {
                    leaves.style.maxHeight = '0px';
                    leaves.style.opacity = '0';
                    leaves.style.overflow = 'hidden';
                    this.style.background = 'var(--bg-white)';
                    this.style.color = 'var(--primary)';
                } else {
                    leaves.style.maxHeight = leaves.scrollHeight + 'px';
                    leaves.style.opacity = '1';
                    leaves.style.overflow = 'visible';
                    this.style.background = 'var(--primary)';
                    this.style.color = 'white';
                }
            });
        });

        // 成绩单标签切换
        function switchGradeTab(tabName) {
            document.querySelectorAll('.grade-tabs .portfolio-tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            document.querySelectorAll('#grades .portfolio-content').forEach(content => content.classList.remove('active'));
            document.getElementById('grade-' + tabName).classList.add('active');
        }

        // 成绩单大图查看
        function openGradeModal(element) {
            const img = element.previousElementSibling;
            const modal = document.createElement('div');
            modal.className = 'grade-modal active';
            modal.innerHTML = `
                <div class="grade-modal-close" onclick="this.parentElement.remove()">&times;</div>
                <img src="${img.src}" alt="成绩单大图">
            `;
            modal.addEventListener('click', function(e) {
                if (e.target === this) this.remove();
            });
            document.body.appendChild(modal);
        }


        // ===== 鼠标动态圆圈特效 =====
        (function() {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            const ring = document.createElement('div');
            ring.className = 'cursor-ring';
            document.body.appendChild(dot);
            document.body.appendChild(ring);

            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX - 6 + 'px';
                dot.style.top = mouseY - 6 + 'px';
            });

            function animateRing() {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                ring.style.left = ringX - 20 + 'px';
                ring.style.top = ringY - 20 + 'px';
                requestAnimationFrame(animateRing);
            }
            animateRing();

            // 悬停交互
            const interactiveElements = document.querySelectorAll('a, button, .branch-node, .skill-leaf, .app-card, .ae-card, .honor-item, .project-card, .contact-simple-item, .grade-tag, .portfolio-tab');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    dot.classList.add('hover');
                    ring.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    dot.classList.remove('hover');
                    ring.classList.remove('hover');
                });
            });

            // 点击涟漪
            document.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = e.clientX + 'px';
                ripple.style.top = e.clientY + 'px';
                document.body.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);

                // 浮动粒子
                for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'float-particle';
                    particle.style.left = e.clientX + 'px';
                    particle.style.top = e.clientY + 'px';
                    const angle = (Math.PI * 2 * i) / 5;
                    const distance = 50 + Math.random() * 50;
                    particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
                    particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 2000);
                }
            });
        })();


        


        


        


        


        


        


        


        


        

    
        // 折叠面板功能
        function toggleCollapse(header) {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapse-icon');
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                content.style.maxHeight = '0px';
                content.style.padding = '0 22px';
                header.classList.remove('active');
            } else {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '16px 22px';
                header.classList.add('active');
            }
        }

        // 图片点击放大查看
        function openImageModal(img, title) {
            const modal = document.createElement('div');
            modal.className = 'img-modal active';
            modal.innerHTML = `
                <button class="img-modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${img.src}" alt="${img.alt}">
                <div class="img-modal-title">${title}</div>
            `;
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // 关闭按钮点击事件
            modal.querySelector('.img-modal-close').addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
            });

            // 点击背景关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                    setTimeout(() => modal.remove(), 300);
                }
            });

            // ESC键关闭
            const escHandler = function(e) {
                if (e.key === 'Escape') {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                    setTimeout(() => modal.remove(), 300);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // AI画廊功能
        function initAIGallery() {
            const aiCards = document.querySelectorAll('.ai-gallery-card');
            
            aiCards.forEach(card => {
                const track = card.querySelector('.ai-gallery-track');
                const slides = card.querySelectorAll('.ai-gallery-slide');
                const dotsContainer = card.querySelector('.ai-gallery-dots');
                const prevBtn = card.querySelector('.ai-gallery-prev');
                const nextBtn = card.querySelector('.ai-gallery-next');
                
                let currentIndex = 0;
                const totalSlides = slides.length;
                
                // 创建圆点指示器
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'ai-gallery-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
                
                const dots = dotsContainer.querySelectorAll('.ai-gallery-dot');
                
                // 更新轮播位置
                function updateGallery() {
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
                
                // 跳转到指定幻灯片
                function goToSlide(index) {
                    currentIndex = (index + totalSlides) % totalSlides;
                    updateGallery();
                }
                
                // 上一张/下一张
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(currentIndex - 1);
                });
                
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToSlide(currentIndex + 1);
                });
                
                // 点击查看大图
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.ai-gallery-nav') || e.target.closest('.ai-gallery-dot')) {
                        return;
                    }
                    const currentImg = slides[currentIndex].querySelector('img');
                    const title = currentImg.dataset.title || 'AI生成数字艺术';
                    openAIGalleryModal(card, currentIndex);
                });
            });
        }
        
        // AI画廊弹窗查看
        function openAIGalleryModal(card, startIndex = 0) {
            const imagesData = JSON.parse(card.dataset.images || '[]');
            if (imagesData.length === 0) return;
            
            let currentIndex = startIndex;
            
            const modal = document.createElement('div');
            modal.className = 'img-modal active';
            modal.innerHTML = `
                <button class="img-modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="ai-modal-gallery">
                    <button class="ai-modal-nav ai-modal-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="ai-modal-image-wrapper">
                        <img src="${imagesData[currentIndex].src}" alt="${imagesData[currentIndex].title}">
                    </div>
                    <button class="ai-modal-nav ai-modal-next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="img-modal-title">
                    <span class="ai-modal-title">${imagesData[currentIndex].title}</span>
                    <span class="ai-modal-counter">${currentIndex + 1} / ${imagesData.length}</span>
                </div>
            `;
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // 更新图片显示
            function updateModalImage() {
                const img = modal.querySelector('.ai-modal-image-wrapper img');
                const title = modal.querySelector('.ai-modal-title');
                const counter = modal.querySelector('.ai-modal-counter');
                img.src = imagesData[currentIndex].src;
                img.alt = imagesData[currentIndex].title;
                title.textContent = imagesData[currentIndex].title;
                counter.textContent = `${currentIndex + 1} / ${imagesData.length}`;
            }
            
            // 上一张/下一张
            function goToModalSlide(index) {
                currentIndex = (index + imagesData.length) % imagesData.length;
                updateModalImage();
            }
            
            modal.querySelector('.ai-modal-prev').addEventListener('click', (e) => {
                e.stopPropagation();
                goToModalSlide(currentIndex - 1);
            });
            
            modal.querySelector('.ai-modal-next').addEventListener('click', (e) => {
                e.stopPropagation();
                goToModalSlide(currentIndex + 1);
            });
            
            // 键盘导航
            const keyHandler = function(e) {
                if (e.key === 'ArrowLeft') {
                    goToModalSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    goToModalSlide(currentIndex + 1);
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            };
            document.addEventListener('keydown', keyHandler);
            
            // 关闭模态框
            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                document.removeEventListener('keydown', keyHandler);
                setTimeout(() => modal.remove(), 300);
            }
            
            modal.querySelector('.img-modal-close').addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        // 为所有图片卡片绑定点击事件
        document.addEventListener('DOMContentLoaded', function() {
            initAIGallery();
            
            document.addEventListener('click', function(e) {
                const card = e.target.closest('.image-card');
                if (card) {
                    const img = card.querySelector('img');
                    const title = card.querySelector('.image-title').textContent;
                    openImageModal(img, title);
                }
            });
        });