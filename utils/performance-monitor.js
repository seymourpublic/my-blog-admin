// Performance monitoring utilities
// utils/performance-monitor.js
export class PerformanceMonitor {
  static measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log({
          pageLoadTime: `${pageLoadTime}ms`,
          domReadyTime: `${domReadyTime}ms`,
          redirectTime: `${perfData.redirectEnd - perfData.redirectStart}ms`,
          dnsTime: `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
          connectTime: `${perfData.connectEnd - perfData.connectStart}ms`,
          requestTime: `${perfData.responseEnd - perfData.requestStart}ms`,
          renderTime: `${perfData.loadEventEnd - perfData.responseEnd}ms`,
        });
        
        // Send to analytics service
        // gtag('event', 'page_load_time', {
        //   value: pageLoadTime,
        //   custom_parameter: 'versablog_admin'
        // });
      });
    }
  }
  
  static measureLCP() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics
        // gtag('event', 'LCP', { value: lastEntry.startTime });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  static measureFID() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
          
          // Send to analytics
          // gtag('event', 'FID', { value: entry.processingStart - entry.startTime });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }
  
  static measureCLS() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0;
      let clsEntries = [];
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = clsEntries[0];
            const lastSessionEntry = clsEntries[clsEntries.length - 1];
            
            if (!firstSessionEntry || 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              clsEntries.push(entry);
              clsValue += entry.value;
            } else {
              clsEntries = [entry];
              clsValue = entry.value;
            }
          }
        });
        
        console.log('CLS:', clsValue);
        
        // Send to analytics
        // gtag('event', 'CLS', { value: clsValue });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  static init() {
    this.measurePageLoad();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
  }
}