// ============================================
// UNIVERSAL EVENT TRACKER
// Paste this entire file into browser console
// Works on ANY webpage including all previous implementations
// ============================================

// Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(function() {
    'use strict';
    
    // Initialize tracker immediately when script runs
    console.log('%c' + '='.repeat(60), 'color: #4CAF50; font-weight: bold;');
    console.log('%c🎯 UNIVERSAL EVENT TRACKER INITIALIZED', 'color: #4CAF50; font-weight: bold; font-size: 18px;');
    console.log('%c' + '='.repeat(60), 'color: #4CAF50; font-weight: bold;');
    console.log('%cAll user interactions will be tracked and logged.', 'color: #666; font-style: italic;');
    console.log('%cAvailable Commands:', 'color: #2196F3; font-weight: bold;');
    console.log('%c  - exportTrackingData()  : Download all tracked events as JSON', 'color: #666;');
    console.log('%c  - getTrackingSummary()  : View summary of tracked events', 'color: #666;');
    console.log('%c  - clearTrackingData()   : Clear all tracked data', 'color: #666;');
    console.log('%c  - pauseTracking()       : Pause event tracking', 'color: #666;');
    console.log('%c  - resumeTracking()      : Resume event tracking', 'color: #666;');
    console.log('%c' + '='.repeat(60), 'color: #4CAF50; font-weight: bold;');
    
    // Global tracking data storage
    window.universalTracker = {
        data: [],
        isPaused: false,
        sessionId: generateSessionId(),
        startTime: new Date().toISOString()
    };
    
    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // ============================================
    // PAGE VIEW TRACKING
    // ============================================
    
    function logPageView() {
        const pageData = {
            eventType: 'PAGE_VIEW',
            sessionId: window.universalTracker.sessionId,
            timestamp: new Date().toISOString(),
            eventNumber: window.universalTracker.data.length + 1,
            page: {
                url: window.location.href,
                pathname: window.location.pathname,
                title: document.title,
                referrer: document.referrer || 'Direct',
                protocol: window.location.protocol,
                host: window.location.host
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio
            },
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            }
        };
        
        // Store in tracking array
        window.universalTracker.data.push(pageData);
        
        // Log to console with beautiful formatting
        console.log('%c╔═══════════════════════════════════════════╗', 'color: #4CAF50; font-weight: bold;');
        console.log('%c║         PAGE VIEW EVENT #' + pageData.eventNumber + '              ║', 'color: #4CAF50; font-weight: bold;');
        console.log('%c╚═══════════════════════════════════════════╝', 'color: #4CAF50; font-weight: bold;');
        console.log('%c⏰ Timestamp:', 'color: #2196F3; font-weight: bold;', pageData.timestamp);
        console.log('%c📄 Page Title:', 'color: #2196F3; font-weight: bold;', pageData.page.title);
        console.log('%c🔗 URL:', 'color: #2196F3; font-weight: bold;', pageData.page.url);
        console.log('%c📐 Viewport:', 'color: #2196F3; font-weight: bold;', pageData.viewport.width + 'x' + pageData.viewport.height);
        console.log('%c🖥️ Screen:', 'color: #2196F3; font-weight: bold;', pageData.screen.width + 'x' + pageData.screen.height);
        console.log('%c🌐 Browser:', 'color: #2196F3; font-weight: bold;', pageData.browser.platform, '-', pageData.browser.language);
        console.groupCollapsed('%c📊 Full Page Data', 'color: #2196F3; font-weight: bold;');
        console.table(pageData);
        console.groupEnd();
    }
    
    // ============================================
    // CLICK EVENT TRACKING
    // ============================================
    
    function setupClickTracking() {
        document.addEventListener('click', function(event) {
            // Skip if tracking is paused
            if (window.universalTracker.isPaused) return;
            
            // Normalize target: prefer an Element (some clicks land on text nodes)
            let target = event.target;
            if (!target) return;
            if (target.nodeType === 3 && target.parentElement) target = target.parentElement;

            // Get comprehensive element data
            const elementData = getElementData(target);
            const cssData = getCSSData(target);
            const positionData = getPositionData(event);
            
            // Create click event object
            const clickData = {
                eventType: 'CLICK',
                sessionId: window.universalTracker.sessionId,
                timestamp: new Date().toISOString(),
                eventNumber: window.universalTracker.data.length + 1,
                element: elementData,
                css: cssData,
                position: positionData,
                mouse: {
                    button: event.button === 0 ? 'Left' : event.button === 1 ? 'Middle' : 'Right',
                    buttons: event.buttons,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                    metaKey: event.metaKey
                },
                timing: {
                    isTrusted: event.isTrusted,
                    timeStamp: event.timeStamp
                }
            };
            
            // Store in tracking array
            window.universalTracker.data.push(clickData);
            
            // Log to console with beautiful formatting
            console.log('%c╔═══════════════════════════════════════════╗', 'color: #FF9800; font-weight: bold;');
            console.log('%c║         CLICK EVENT #' + clickData.eventNumber + '                ║', 'color: #FF9800; font-weight: bold;');
            console.log('%c╚═══════════════════════════════════════════╝', 'color: #FF9800; font-weight: bold;');
            console.log('%c⏰ Timestamp:', 'color: #9C27B0; font-weight: bold;', clickData.timestamp);
            console.log('%c🎯 Element:', 'color: #9C27B0; font-weight: bold;', elementData.tagName);
            
            if (elementData.id) {
                console.log('%c🆔 ID:', 'color: #9C27B0; font-weight: bold;', '#' + elementData.id);
            }
            
            if (elementData.classes.length > 0) {
                console.log('%c🏷️ Classes:', 'color: #9C27B0; font-weight: bold;', elementData.classes.join(', '));
            }
            
            if (elementData.text && elementData.text.length > 0) {
                console.log('%c📝 Text:', 'color: #9C27B0; font-weight: bold;', elementData.text);
            }
            
            console.log('%c📍 Position:', 'color: #9C27B0; font-weight: bold;', 
                'X:' + positionData.clientX + ', Y:' + positionData.clientY);
            
            console.log('%c🖱️ Mouse Button:', 'color: #9C27B0; font-weight: bold;', clickData.mouse.button);
            
            console.log('%c🎨 DOM Path:', 'color: #9C27B0; font-weight: bold;', elementData.path);
            
            console.groupCollapsed('%c📊 CSS Properties', 'color: #9C27B0; font-weight: bold;');
            console.table(cssData.computed);
            console.groupEnd();
            
            console.groupCollapsed('%c📦 Full Click Data', 'color: #9C27B0; font-weight: bold;');
            console.log(clickData);
            console.groupEnd();
            
        }, true); // Use capture phase to catch all events
    }
    
    // ============================================
    // HELPER FUNCTIONS - ELEMENT DATA
    // ============================================
    
    function getElementData(element) {
        // Defensive handling: if a text node is clicked, use its parent element
        if (!element) return { tagName: 'unknown' };
        if (element.nodeType === 3 && element.parentElement) element = element.parentElement;
        if (!element || !element.tagName) return { tagName: 'unknown' };

        const data = {
            tagName: element.tagName.toLowerCase(),
            id: element.id || null,
            classes: [],
            text: element.textContent ? element.textContent.substring(0, 100).trim() : null,
            value: element.value || null,
            type: element.type || null,
            name: element.name || null,
            href: element.href || null,
            src: element.src || null,
            alt: element.alt || null,
            title: element.title || null,
            placeholder: element.placeholder || null,
            attributes: {},
            path: getElementPath(element),
            xpath: getElementXPath(element),
            boundingRect: null,
            isVisible: isElementVisible(element),
            parentElement: element.parentElement ? element.parentElement.tagName.toLowerCase() : null
        };

        try {
            if (element.className && typeof element.className === 'string') {
                data.classes = element.className.split(' ').filter(c => c.trim());
            } else if (element.classList) {
                data.classes = Array.from(element.classList);
            }
        } catch (e) {
            data.classes = [];
        }

        // attributes
        try {
            if (element.attributes) {
                Array.from(element.attributes).forEach(attr => {
                    data.attributes[attr.name] = attr.value;
                });
            }
        } catch (e) {}

        try {
            if (typeof element.getBoundingClientRect === 'function') {
                const r = element.getBoundingClientRect();
                data.boundingRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
            }
        } catch (e) {
            data.boundingRect = null;
        }

        return data;
    }
    
    // ============================================
    // HELPER FUNCTIONS - CSS DATA
    // ============================================
    
    function getCSSData(element) {
        let computed = null;
        try {
            computed = window.getComputedStyle(element);
        } catch (e) {
            computed = null;
        }

        const safe = value => (typeof value === 'undefined' ? null : value);

        return {
            inline: element && element.style ? (element.style.cssText || null) : null,
            computed: computed ? {
                display: safe(computed.display),
                visibility: safe(computed.visibility),
                opacity: safe(computed.opacity),
                position: safe(computed.position),
                top: safe(computed.top),
                left: safe(computed.left),
                right: safe(computed.right),
                bottom: safe(computed.bottom),
                zIndex: safe(computed.zIndex),
                width: safe(computed.width),
                height: safe(computed.height),
                margin: safe(computed.margin),
                padding: safe(computed.padding),
                border: safe(computed.border),
                backgroundColor: safe(computed.backgroundColor),
                color: safe(computed.color),
                fontSize: safe(computed.fontSize),
                fontFamily: safe(computed.fontFamily),
                fontWeight: safe(computed.fontWeight),
                textAlign: safe(computed.textAlign),
                cursor: safe(computed.cursor),
                transform: safe(computed.transform),
                transition: safe(computed.transition),
                animation: safe(computed.animation)
            } : {},
            classList: element && element.classList ? Array.from(element.classList) : [],
            pseudo: {
                before: element ? getPseudoContent(element, '::before') : null,
                after: element ? getPseudoContent(element, '::after') : null
            }
        };
    }
    
    function getPseudoContent(element, pseudoEl) {
        try {
            const content = window.getComputedStyle(element, pseudoEl).content;
            return content !== 'none' ? content : null;
        } catch (e) {
            return null;
        }
    }
    
    // ============================================
    // HELPER FUNCTIONS - POSITION DATA
    // ============================================
    
    function getPositionData(event) {
        return {
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            screenX: event.screenX,
            screenY: event.screenY,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
            movementX: event.movementX,
            movementY: event.movementY,
            viewportPercent: {
                x: Math.round((event.clientX / window.innerWidth) * 100),
                y: Math.round((event.clientY / window.innerHeight) * 100)
            }
        };
    }
    
    // ============================================
    // HELPER FUNCTIONS - DOM PATH
    // ============================================
    
    function getElementPath(element) {
        const path = [];
        let current = element;
        
        while (current && current !== document.documentElement) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id) {
                selector += '#' + current.id;
                path.unshift(selector);
                break; // ID is unique, no need to go further
            }
            
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                }
            }
            
            // Add nth-child if no ID
            if (!current.id) {
                let siblings = Array.from(current.parentElement?.children || []);
                let index = siblings.indexOf(current) + 1;
                selector += ':nth-child(' + index + ')';
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }
    
    function getElementXPath(element) {
        // Handle nulls and text nodes
        if (!element) return '';
        if (element.nodeType === 3 && element.parentNode) element = element.parentNode;

        if (element.id) {
            return '//*[@id="' + element.id + '"]';
        }

        if (element === document.body) return '/html/body';

        const parts = [];
        let current = element;

        while (current && current.nodeType === 1 && current !== document.documentElement) {
            let index = 1;
            let sibling = current.previousSibling;
            while (sibling) {
                if (sibling.nodeType === 1 && sibling.tagName === current.tagName) index++;
                sibling = sibling.previousSibling;
            }

            parts.unshift(current.tagName.toLowerCase() + '[' + index + ']');
            current = current.parentNode;
            if (!current) break;
            if (current === document.documentElement) break;
        }

        return '/html/' + parts.join('/');
    }
    
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    }
    
    // ============================================
    // SCROLL EVENT TRACKING
    // ============================================
    
    function setupScrollTracking() {
        let scrollTimeout;
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            if (window.universalTracker.isPaused) return;
            
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                const scrollData = {
                    eventType: 'SCROLL',
                    sessionId: window.universalTracker.sessionId,
                    timestamp: new Date().toISOString(),
                    eventNumber: window.universalTracker.data.length + 1,
                    position: {
                        x: window.scrollX,
                        y: window.scrollY,
                        direction: window.scrollY > lastScrollY ? 'down' : 'up'
                    },
                    percentage: {
                        vertical: Math.round((window.scrollY / 
                            (document.documentElement.scrollHeight - window.innerHeight)) * 100) || 0,
                        horizontal: Math.round((window.scrollX / 
                            (document.documentElement.scrollWidth - window.innerWidth)) * 100) || 0
                    },
                    documentSize: {
                        width: document.documentElement.scrollWidth,
                        height: document.documentElement.scrollHeight
                    }
                };
                
                lastScrollY = window.scrollY;
                window.universalTracker.data.push(scrollData);
                
                console.log('%c📜 SCROLL EVENT #' + scrollData.eventNumber, 
                    'color: #795548; font-weight: bold;', 
                    'Y:' + scrollData.position.y + 'px (' + scrollData.percentage.vertical + '%) ' + 
                    scrollData.position.direction.toUpperCase());
                
            }, 300); // Debounce scroll events
        });
    }
    
    // ============================================
    // VISIBILITY TRACKING
    // ============================================
    
    function setupVisibilityTracking() {
        document.addEventListener('visibilitychange', function() {
            if (window.universalTracker.isPaused) return;
            
            const visibilityData = {
                eventType: 'VISIBILITY_CHANGE',
                sessionId: window.universalTracker.sessionId,
                timestamp: new Date().toISOString(),
                eventNumber: window.universalTracker.data.length + 1,
                hidden: document.hidden,
                state: document.visibilityState
            };
            
            window.universalTracker.data.push(visibilityData);
            
            console.log('%c👁️ VISIBILITY CHANGE #' + visibilityData.eventNumber, 
                'color: #00BCD4; font-weight: bold;', 
                'Page is now:', document.hidden ? 'HIDDEN' : 'VISIBLE');
        });
    }
    
    // ============================================
    // KEYBOARD EVENT TRACKING
    // ============================================
    
    function setupKeyboardTracking() {
        document.addEventListener('keydown', function(event) {
            if (window.universalTracker.isPaused) return;
            
            const keyData = {
                eventType: 'KEYDOWN',
                sessionId: window.universalTracker.sessionId,
                timestamp: new Date().toISOString(),
                eventNumber: window.universalTracker.data.length + 1,
                key: {
                    key: event.key,
                    code: event.code,
                    keyCode: event.keyCode,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                    metaKey: event.metaKey
                },
                target: {
                    tagName: event.target.tagName.toLowerCase(),
                    id: event.target.id || null,
                    type: event.target.type || null
                }
            };
            
            window.universalTracker.data.push(keyData);
            
            console.log('%c⌨️ KEYDOWN EVENT #' + keyData.eventNumber, 
                'color: #9C27B0; font-weight: bold;', 
                'Key:', event.key, 'on', event.target.tagName.toLowerCase());
        });
    }
    
    // ============================================
    // FORM EVENT TRACKING
    // ============================================
    
    function setupFormTracking() {
        document.addEventListener('submit', function(event) {
            if (window.universalTracker.isPaused) return;
            
            const form = event.target;
            const formData = {
                eventType: 'FORM_SUBMIT',
                sessionId: window.universalTracker.sessionId,
                timestamp: new Date().toISOString(),
                eventNumber: window.universalTracker.data.length + 1,
                form: {
                    id: form.id || null,
                    name: form.name || null,
                    action: form.action || null,
                    method: form.method || null,
                    fields: {}
                }
            };
            
            // Capture form field values (excluding passwords)
            const formElements = form.elements;
            for (let i = 0; i < formElements.length; i++) {
                const field = formElements[i];
                if (field.name && field.type !== 'password') {
                    formData.form.fields[field.name] = field.value;
                }
            }
            
            window.universalTracker.data.push(formData);
            
            console.log('%c📝 FORM SUBMIT #' + formData.eventNumber, 
                'color: #FF5722; font-weight: bold;', formData.form);
        }, true);
    }
    
    // ============================================
    // EXPORT FUNCTIONS (Global Access)
    // ============================================
    
    window.exportTrackingData = function() {
        if (!window.universalTracker.data || window.universalTracker.data.length === 0) {
            console.warn('⚠️ No tracking data available to export');
            return;
        }
        
        const exportData = {
            sessionId: window.universalTracker.sessionId,
            startTime: window.universalTracker.startTime,
            endTime: new Date().toISOString(),
            totalEvents: window.universalTracker.data.length,
            events: window.universalTracker.data
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tracking-data-' + window.universalTracker.sessionId + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('%c✅ SUCCESS: Tracking data exported!', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%c📊 Total Events:', 'color: #4CAF50; font-weight: bold;', exportData.totalEvents);
        console.log('%c⏰ Session Duration:', 'color: #4CAF50; font-weight: bold;', 
            new Date(exportData.endTime) - new Date(exportData.startTime) + 'ms');
    };
    
    window.getTrackingSummary = function() {
        if (!window.universalTracker.data || window.universalTracker.data.length === 0) {
            console.warn('⚠️ No tracking data available');
            return;
        }
        
        const summary = {
            totalEvents: window.universalTracker.data.length,
            eventsByType: {},
            sessionId: window.universalTracker.sessionId,
            sessionStart: window.universalTracker.startTime,
            currentTime: new Date().toISOString()
        };
        
        // Count events by type
        window.universalTracker.data.forEach(event => {
            const type = event.eventType;
            summary.eventsByType[type] = (summary.eventsByType[type] || 0) + 1;
        });
        
        console.log('%c' + '='.repeat(60), 'color: #E91E63; font-weight: bold;');
        console.log('%c📊 TRACKING SUMMARY', 'color: #E91E63; font-weight: bold; font-size: 16px;');
        console.log('%c' + '='.repeat(60), 'color: #E91E63; font-weight: bold;');
        console.log('%c🆔 Session ID:', 'color: #E91E63; font-weight: bold;', summary.sessionId);
        console.log('%c⏰ Session Start:', 'color: #E91E63; font-weight: bold;', summary.sessionStart);
        console.log('%c📈 Total Events:', 'color: #E91E63; font-weight: bold;', summary.totalEvents);
        console.log('%c📊 Events by Type:', 'color: #E91E63; font-weight: bold;');
        console.table(summary.eventsByType);
        console.log('%c' + '='.repeat(60), 'color: #E91E63; font-weight: bold;');
        
        return summary;
    };
    
    window.clearTrackingData = function() {
        const count = window.universalTracker.data.length;
        window.universalTracker.data = [];
        console.log('%c🗑️ Cleared ' + count + ' tracked events', 'color: #FF5722; font-weight: bold;');
    };
    
    window.pauseTracking = function() {
        window.universalTracker.isPaused = true;
        console.log('%c⏸️ Tracking PAUSED', 'color: #FF9800; font-weight: bold;');
    };
    
    window.resumeTracking = function() {
        window.universalTracker.isPaused = false;
        console.log('%c▶️ Tracking RESUMED', 'color: #4CAF50; font-weight: bold;');
    };
    
    // ============================================
    // INITIALIZE ALL TRACKING
    // ============================================
    
    // Log initial page view
    logPageView();
    
    // Set up all event listeners
    setupClickTracking();
    setupScrollTracking();
    setupVisibilityTracking();
    setupKeyboardTracking();
    setupFormTracking();
    
    // Final initialization message
    console.log('%c✅ All tracking systems initialized successfully!', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log('%c💡 Tip: Try clicking around and then run getTrackingSummary()', 'color: #666; font-style: italic;');
    
})(); // End of IIFE