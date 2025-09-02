/**
 * 字体加载工具
 */

// 检查字体是否已加载
export const isFontLoaded = (fontFamily: string): boolean => {
  if (typeof document === 'undefined') return false;
  
  const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const testSize = '72px';
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return false;
  
  // 获取默认字体的宽度
  context.font = `${testSize} sans-serif`;
  const defaultWidth = context.measureText(testString).width;
  
  // 获取目标字体的宽度
  context.font = `${testSize} ${fontFamily}, sans-serif`;
  const targetWidth = context.measureText(testString).width;
  
  return defaultWidth !== targetWidth;
};

// 使用 FontFace API 加载字体（如果支持）
export const loadFontWithFontFaceAPI = (fontFamily: string, fontUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof FontFace === 'undefined') {
      resolve(false);
      return;
    }

    try {
      const font = new FontFace(fontFamily, `url(${fontUrl})`);
      
      font.load().then(() => {
        document.fonts.add(font);
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    } catch (error) {
      resolve(false);
    }
  });
};

// 预加载字体
export const preloadFont = (fontFamily: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    // 如果字体已经加载，直接返回
    if (isFontLoaded(fontFamily)) {
      resolve(true);
      return;
    }

    // 创建测试元素
    const testElement = document.createElement('span');
    testElement.style.fontFamily = `${fontFamily}, sans-serif`;
    testElement.style.fontSize = '72px';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.whiteSpace = 'nowrap';
    testElement.textContent = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    document.body.appendChild(testElement);
    
    // 检查字体是否加载完成
    const checkFont = () => {
      if (isFontLoaded(fontFamily)) {
        document.body.removeChild(testElement);
        resolve(true);
      } else {
        setTimeout(checkFont, 100);
      }
    };
    
    // 开始检查
    setTimeout(checkFont, 100);
    
    // 设置超时
    setTimeout(() => {
      if (document.body.contains(testElement)) {
        document.body.removeChild(testElement);
      }
      resolve(false);
    }, 5000);
  });
};

// 加载 YouSheBiaoTiHei 字体
export const loadYouSheFont = async (): Promise<boolean> => {
  try {
    // 首先尝试使用 FontFace API
    const fontFaceLoaded = await loadFontWithFontFaceAPI('YouSheBiaoTiHei', '/fonts/YouSheBiaoTiHei.ttf');
    
    if (fontFaceLoaded) {
      document.body.classList.add('font-loaded');
      return true;
    }
    
    // 如果 FontFace API 失败，使用传统方法
    const loaded = await preloadFont('YouSheBiaoTiHei');
    if (loaded) {
      document.body.classList.add('font-loaded');
    }
    return loaded;
  } catch (error) {
    console.warn('字体加载失败:', error);
    return false;
  }
};

// 监听字体加载状态变化
export const watchFontLoad = (fontFamily: string, callback: (loaded: boolean) => void) => {
  if (typeof document === 'undefined') return;
  
  // 检查是否支持 Font Loading API
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      const loaded = isFontLoaded(fontFamily);
      callback(loaded);
    });
  } else {
    // 降级到轮询检查
    const checkInterval = setInterval(() => {
      if (isFontLoaded(fontFamily)) {
        clearInterval(checkInterval);
        callback(true);
      }
    }, 100);
    
    // 设置超时
    setTimeout(() => {
      clearInterval(checkInterval);
      callback(false);
    }, 5000);
  }
};

