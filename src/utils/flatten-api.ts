export default function flattenApiPaths<T extends Record<string, unknown>>(obj: T): Record<string, string> {
  const result: Record<string, string> = {};

  function traverse(current: Record<string, unknown>) {
    for (const key in current) {
      if (typeof current[key] === 'string') {
        // 如果 key 已经存在，可以选择覆盖或抛出错误
        if (result[key]) {
          console.warn(`Duplicate key detected: ${key}`);
        }
        result[key] = current[key];
      } else if (typeof current[key] === 'object' && current[key] !== null) {
        traverse(current[key] as Record<string, unknown>); 
      }
    }
  }

  traverse(obj);
  return result;
}