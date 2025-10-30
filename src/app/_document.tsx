import { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced bis_skin_checked removal script
              (function() {
                // More aggressive removal function
                function removeBisSkin() {
                  try {
                    // Use a more direct approach to remove the attribute
                    const removeFromElement = (element) => {
                      if (element && element.removeAttribute) {
                        element.removeAttribute('bis_skin_checked');
                      }
                    };
                    
                    // Remove from document and body first
                    removeFromElement(document.documentElement);
                    removeFromElement(document.body);
                    
                    // Remove from all elements in the document
                    if (document.querySelectorAll) {
                      // Use a more specific selector to avoid potential issues
                      const elements = document.querySelectorAll('[bis_skin_checked]');
                      for (let i = 0; i < elements.length; i++) {
                        removeFromElement(elements[i]);
                      }
                      return elements.length > 0;
                    }
                    return false;
                  } catch (e) {
                    // Silently fail to avoid console pollution
                    return false;
                  }
                }
                
                // Run immediately
                if (document.readyState === 'loading') {
                  // If document is still loading, wait for it
                  document.addEventListener('DOMContentLoaded', () => {
                    // Initial removal
                    removeBisSkin();
                    
                    // Schedule multiple cleanup passes
                    [10, 50, 100, 200, 500, 1000, 2000].forEach(timeout => {
                      setTimeout(removeBisSkin, timeout);
                    });
                    
                    // Also use MutationObserver to catch dynamic additions
                    if (typeof MutationObserver !== 'undefined') {
                      const observer = new MutationObserver((mutations) => {
                        removeBisSkin();
                      });
                      
                      observer.observe(document.documentElement, {
                        attributes: true,
                        childList: true,
                        subtree: true,
                        attributeFilter: ['bis_skin_checked']
                      });
                    }
                  });
                } else {
                  // If document is already loaded
                  removeBisSkin();
                  
                  // Schedule cleanup passes
                  [10, 50, 100, 200, 500, 1000, 2000].forEach(timeout => {
                    setTimeout(removeBisSkin, timeout);
                  });
                }
                  
                  // Show the page after cleanup
                  if (document.body) {
                    document.body.style.visibility = 'visible';
                  }
                });
                
                // Set up MutationObserver to watch for attribute changes
                if (typeof MutationObserver !== 'undefined') {
                  const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                        removeBisSkin();
                        break;
                      }
                      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        removeBisSkin();
                        break;
                      }
                    }
                  });
                  
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['bis_skin_checked'],
                    childList: true,
                    subtree: true,
                  });
                  
                  // Also observe the body
                  if (document.body) {
                    observer.observe(document.body, {
                      attributes: true,
                      attributeFilter: ['bis_skin_checked'],
                      childList: true,
                      subtree: true,
                    });
                  }
                  
                  // Clean up observer on page unload
                  window.addEventListener('unload', () => {
                    observer.disconnect();
                  });
                }
              })();
            `,
          }}
        />
      </Head>
      <body style={{ visibility: 'hidden' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
