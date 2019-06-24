### 行内放 inline-block 元素时, 如何确定  inline-block 元素的基线

_**2019-06-03**_

_原来对于规范的理解有误, 认为设置 overflow属性为除了 visible 之外的值是触发 `BFC` , 所以` inline-block`元素的基线对齐 `bottom margin edge`. 其实`display: inline-block`已经触发了`BFC`_

- 先下结论
  - `inline-block `内部无流内的`inline`/`inline-block`元素 或者`overflow`为除`visible`外其他值, 其 `baseline`对齐下 margin 的下边缘
  - 如果有流内的`inline`/`inline-block`元素时, 按最后一个`line box`的 `baseline`计算
    - 最后一个`line box` 是 `inline`元素(即文本)时, 按文本的`baseline`(注意, 如果` inline-block`元素内包含了`block`元素, `block`元素内又放了文本, 此时还是以文本的`baseline`为基准)
    - 最后一个`line box` 是 `inline-block`元素时, 按本规则继续判断(根据子`inline-block`元素内包含文本还是 `inline-block`元素确定`baseline`)
      - 如何确定最后一个 `line-box`?
      - [JsbinDemo](<https://jsbin.com/qesuhug/2/edit?html,css,output>)
  - [Gitpage Demo](http://thxiami.github.io/miao/note/baseline-rule-of-Inline-block-element.html)/[jsbin Demo](https://jsbin.com/bidatucexo/3/edit?html,css,output)

- `line box`的定义
  - [w3中关于 line box 的定义](<https://www.w3.org/TR/CSS2/visuren.html#inline-formatting>)
  - ![xx](https://ws4.sinaimg.cn/large/006tNc79ly1g3g00qwo3tj315z0g07ak.jpg)
- `Line height calculations`的计算, 注意是行框的高度
  - ![](https://ws1.sinaimg.cn/large/006tNc79ly1g3nqbo7jb0j317p0ljkj0.jpg)
  - [w3中关于Line height calculations的规则](<https://www.w3.org/TR/CSS2/visudet.html#line-height>)
- ~~触发 BFC 的条件~~
  - ~~![](https://ws2.sinaimg.cn/large/006tNc79ly1g3g4gym9hgj30vu0npafb.jpg)~~
  - ~~[Block Format Context介绍及触发条件]~~(<https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context>)