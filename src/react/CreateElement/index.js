export default function createElement(type, props, ...children) {
    // 遍历children对象
    const childElements = [].concat(...children).reduce((result, child) => {
      // 判断child不能是布尔也不能是null
      // 因为使用reduce，所以result是前一次循环的返回值，最终返回result就可以
      if (child !== false && child !== true && child !== null) {
        if (child instanceof Object) {
          result.push(child); // 是对象直接返回
        } else {
          // 不是对象 调用createElement方法生成一个对象
          result.push(createElement('text', {
            textContent: child
          }));
        }
      }
      return result;
    }, [])
    return {
      type,
      props: Object.assign({ children: childElements}, props)
    }
  }
  