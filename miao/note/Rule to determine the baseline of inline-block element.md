### 行内放 inline-block 元素时, 如何计算其父元素的行框高度

- 先下结论
  - `inline-block `内部无`inline`/`inline-block`元素时, 其 `baseline`按 margin 的下边缘计算
  - 如果有`inline`/`inline-block`元素时, 按最后一个`line box`的 `baseline`计算
    - 最后一个`line box` 是 `inline`元素(即文本)时, 按文本的`baseline`
    - 最后一个`line box` 是 `inline-block`元素时, 按本规则继续判断(分是文本还是 `inline-block`确定`baseline`)

- `line-box`的定义
  - <https://www.w3.org/TR/CSS2/visuren.html#inline-formatting>
  - ![xx](https://ws4.sinaimg.cn/large/006tNc79ly1g3g00qwo3tj315z0g07ak.jpg)
- `Line height calculations`的计算, 注意是行框的高度
  - <https://www.w3.org/TR/CSS2/visudet.html#line-height>
  - ![](https://ws4.sinaimg.cn/large/006tNc79ly1g3g03hal2ij31820olwn1.jpg)
- 触发 BFC 的条件
  - ![](https://ws1.sinaimg.cn/large/006tNc79ly1g3g0507boxj316d0qt7bb.jpg)
  - <https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context>