### 行内放 inline-block 元素时, 如何计算其父元素的行框高度

- 先下结论
  - `inline-block `内部无流内的`inline`/`inline-block`元素 或者触发了 BFC([Block Format Context](<https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context>))时(比如`overflow`为除`visible`外其他值), 其 `baseline`对齐下 margin 的下边缘
  - 如果有流内的`inline`/`inline-block`元素时, 按最后一个`line box`的 `baseline`计算
    - 最后一个`line box` 是 `inline`元素(即文本)时, 按文本的`baseline`
    - 最后一个`line box` 是 `inline-block`元素时, 按本规则继续判断(分是文本还是 `inline-block`确定`baseline`)
  - [Demo](https://jsbin.com/bidatucexo/2/edit?html,css,output)

- `line box`的定义
  - [w3中关于 line box 的定义](<https://www.w3.org/TR/CSS2/visuren.html#inline-formatting>)
  - ![xx](https://ws4.sinaimg.cn/large/006tNc79ly1g3g00qwo3tj315z0g07ak.jpg)
- `Line height calculations`的计算, 注意是行框的高度
  - ![](https://ws4.sinaimg.cn/large/006tNc79ly1g3g03hal2ij31820olwn1.jpg)
  - [w3中关于Line height calculations的规则](<https://www.w3.org/TR/CSS2/visudet.html#line-height>)
- 触发 BFC 的条件
  - ![](https://ws2.sinaimg.cn/large/006tNc79ly1g3g4gym9hgj30vu0npafb.jpg)
  - [Block Format Context介绍及触发条件](<https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context>)