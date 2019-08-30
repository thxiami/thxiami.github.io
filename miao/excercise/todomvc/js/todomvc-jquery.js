// todo id 为不重复, 使用时间戳 -> md5/sha
// todo items 改为 map 结构, id 为 key
// todo 双击编辑 todo
// todo 增加 addEventListener 的 option, 设置 passive 为 true, 参考 https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// todo 关于 items left 的状态维护, 和添加删除 载入数据库等逻辑的耦合和分离
// todo css 中 BEM items-container 下的 item 以及 item__text 都摊平了属于 items-container
/*
  todo isEdit 这个 flag 有没有其他的模式可以实现,
      存在有问题: 连续点击时, 如果 isEdit 的修改放在逻辑函数的末尾, 可能函数还未执行完毕, isEdit 还未修改, 就又可以再点击了
 */

$(document).ready(function () {


  const classMap = {
    block: {
      item: 'item',
      tabsContainer: 'footer__tabs-container',
      footer: 'footer',
    },
    el: {
      btnDel: 'item__btn-delete',
      ckbox: 'item__ckbox',
      text: 'item__text',
      container: 'items-container',
      editInput: 'item__edit-input'
    },
    modifier: {
      item: {
        completed: 'item_completed',
        edit: 'item_is-edit',
      },
      footer: {
        tabSelected: 'footer__tab_selected'
      },
      container: {
        completed: 'items-container_completed',
        active: 'items-container_active',
      },
    }
  }

  const idMap = {
    tab: {
      active: 'tab-active',
      all: 'tab-all',
      completed: 'tab-completed',
    },
    btn: {
      checkAll: 'btn-ckall',
      deleteCompleted: 'btn-del-completed',
    },
  }

  const input = $('#input-todo')
  const itemsContainer = $('.items-container')
  const leftCountText = $('#left-count')
  const tabsContainer = $('.' + classMap.block.tabsContainer)
  const ckallBtn = $('#' + idMap.btn.checkAll)
  const ckallBtnLabel = $(`[for="${idMap.btn.checkAll}"]`)
  const delCompletedBtn = $('#' + idMap.btn.deleteCompleted)
  const footer = $('.' + classMap.block.footer)

  // 这里是给了格式范例, 真正的 id 和 items 会从 localstorage 中读取
  let id
  let items
  let clickTimerId = null
  // let items = [
  //   {
  //     id: '',
  //     text:'',
  //     isCompleted: false,
  //   },
  // ]

  // 未完成的 items 数量写成 setter 和 getter 的形式, 可以将数据和视图的变化绑定在一起
  // 增加了一个 leftCount 变量是为了
  let status = {
    isEdit: false,
    leftCount: 0,

    get uncompletedItemsCount() {
      return this.leftCount
    },
    set uncompletedItemsCount(count) {
      // 当全部都为完成时, 再点击删除, count 为负数
      count = Math.max(0, count)
      console.log(`**DEBUG uncompletedItemsCount count:`, count)
      this.leftCount = count
      leftCountText.text(count)
      const totalCount = items.length
      const completedCounts = totalCount - count
      updateInteractAreaDisplayStatus(totalCount, completedCounts)
    },
  }

  function showCkAllBtn() {
    ckallBtn.show()
    ckallBtnLabel.show()
  }

  function hideCkAllBtn() {
    ckallBtn.hide()
    ckallBtnLabel.hide()
    ckallBtn.prop('checked', false)
  }

  /**
   * 根据总数和已完成的数量更新交互区域的显示状态
   */
  function updateInteractAreaDisplayStatus(totalCount, completedCounts) {
    console.log(`**DEBUG updateInteractAreaDisplayStatus totalCount:`, totalCount)
    console.log(`**DEBUG updateInteractAreaDisplayStatus completedCounts:`, completedCounts)

    toggleCkAllBtn(totalCount, completedCounts)
    toggleFooter(totalCount)
    toggleClearBtn(completedCounts)
  }


  function toggleCkAllBtn(totalCount, completedCounts) {
    if (totalCount === 0) {
      hideCkAllBtn()

    } else {
      showCkAllBtn()
      if (completedCounts === totalCount) {
        ckallBtn.prop('checked', true)
      } else if (completedCounts < totalCount) {
        ckallBtn.prop('checked', false)
      }
    }
  }

  function toggleFooter(totalCount) {
    if (totalCount > 0) {
      footer.show()
    } else {
      // = 0
      footer.hide()

    }
  }

  function toggleClearBtn(completedCounts) {
    console.log(`**DEBUG toggleClearBtn completedCounts:`, completedCounts)
    if (completedCounts > 0) {
      // 有完成的
      delCompletedBtn.show()
    } else {
      delCompletedBtn.hide()
    }
  }

  function getItemById(id) {
    for (let item of items) {
      if (item.id === id) {
        return item
      }
    }

    return null
  }

  function getItemDomById(id) {
    return document.querySelector(`[data-id="${id}"]`)
  }

  function getIdByItemDom(element) {
    if (isItemDom(element)) {
      return element.dataset.id
    }
  }

  function isItemDom(element) {
    if (element !== null && element !== undefined) {
      return element.matches('.' + classMap.block.item)
    }
    return false
  }

  function createId() {
      return String(id++)
  }

  function createItemHtml(item) {
    return `
      <li class="item ${item.isCompleted ? `${classMap.modifier.item.completed}` : ''}"
          data-id="${item.id}"
      >
        <div class="item__icon-check"></div>
        <input type="checkbox" class="item__ckbox" ${item.isCompleted ? 'checked' : ''}>
        <div class="item__text">${item.text}</div>
        <div class="item__btn-delete">X</div>
      </li>
    `
  }

  function insertItemDom(item) {
    const itemInnerHtml = createItemHtml(item)

    const itemDom = $(itemInnerHtml)
    itemsContainer.append(itemDom)
  }

  function addItem(text) {
    // todo id 为不重复, 使用时间戳 -> md5/sha

    if (text.length > 0) {
      const id = createId()
      const item = {
        id,
        text,
        isCompleted: false,
      }

      insertItemDom(item)

      items.push(item)
      status.uncompletedItemsCount += 1
    }
  }

  function deleteItem(id) {
    debugger
    // todo 测试下删除
    const item = getItemById(id)
    if (item !== null) {
      const idx = items.indexOf(item)
      items.splice(idx, 1)

      if (!item.isCompleted) {
        status.uncompletedItemsCount -= 1
      } else {
        // 为了触发交互区域的状态更新
        status.uncompletedItemsCount -= 0
      }
    }
  }

  function removeItemDom(id) {
    $(`[data-id="${id}"]`).remove()
  }

  function updateItem(itemId, text) {

  }

  /**
   *
   * @param {string}id
   * @param {boolean}isCompleted
   */
  function setItemDataCompleted(id, isCompleted) {
    if (typeof id !== 'string') {
      throw new Error('type of parameter error, expected number, got:'+ typeof id)
    }

    for (let item of items) {
      if (item.id === id) {
        item.isCompleted = isCompleted
        if (isCompleted) {
          status.uncompletedItemsCount -= 1
        } else {
          status.uncompletedItemsCount += 1
        }
        return
      }
    }
  }

  function changeItemViewCompleted(el, isCompleted) {
    const jqEl = $(el.parentNode)
    const className = classMap.modifier.item.completed

    if (isCompleted) {
      jqEl.addClass(className)
    } else{
      jqEl.removeClass(className)
    }
  }

  // todo 待优化, 可以放一个变量存储数量, 也放在 localstorage 中
  function getUncompletedItemsCount(items) {
    return items.reduce((acc, item) => {
      return item.isCompleted ? acc : acc + 1
    }, 0)
  }

  /**
   * 为 item 的 checkbox 注册点击事件
   */
  function onItemCheckboxClick(target, id) {
    console.log(`**DEBUG 点击了 ckbox items:`, items)

    const isCompleted = target.checked
    changeItemViewCompleted(target, isCompleted)
    setItemDataCompleted(id, isCompleted)
  }

  /**
   * 为 item 删除按钮注册点击事件
   */
  function onItemDeleteBtnClick(target, id) {
    console.log(`**DEBUG 点击了 删除按钮`)
    deleteItem(id)
    removeItemDom(id)
  }

  function onItemClick(e) {
    console.log(`**DEBUG itemsContainer click e:`, e)

    const parent = e.target.parentNode

    if (e.target.classList.contains(classMap.el.ckbox)) {
      const id = getIdByItemDom(parent) // 注意类型是 string
      // clickTimerId = setTimeout(() => onItemCheckboxClick(e.target, id), 100)
      onItemCheckboxClick(e.target, id)
    }

    if (e.target.classList.contains(classMap.el.btnDel)) {
      const id = getIdByItemDom(parent) // 注意类型是 string
      // clickTimerId = setTimeout(() => onItemDeleteBtnClick(e.target, id), 100)
      onItemDeleteBtnClick(e.target, id)
    }

    if (status.isEdit && !isItemEditInputDom(e.target)) {
      exitEdit()
    }
  }

  /**
   * 为 item 绑定双击编辑事件
   * 双击时增加一个 input, 绝对定位, 覆盖住前面的text 和删除按钮
   */
  function onItemDbclick(e) {
    // console.log(`**DEBUG dbclick e:`, e)
    const tar = e.target
    const isDbClickItemText = isItemTextDom(tar)

    if (!status.isEdit && isDbClickItemText) {
      // 此时不可能直接通过双击来编辑其他的 item 文本内容, 因为单击其他区域会退出正在编辑的input框
      const itemId = getIdByItemDom(tar.parentNode)
      status.isEdit = true
      startEditItem(itemId)

    }
  }

  function isItemTextDom(element) {
    return element.classList.contains(classMap.el.text)
  }

  function isItemEditInputDom(element) {
     return element.classList.contains(classMap.el.editInput)
  }

  function startEditItem(id) {
    // todo 设置编辑的标签
    // todo 新增 input
    // todo 新增 class
    const itemDom = getItemDomById(id)
    const item = getItemById(id)

    if (itemDom !== null) {
      itemDom.classList.add(classMap.modifier.item.edit)
      itemDom.appendChild(createNewInputDom(item.text))
    }
  }

  function exitEdit() {
    const editingItemDom = getIsEditItem()
    if (editingItemDom !== null) {
      status.isEdit = false
      // todo 更新 data
      // todo 删除 input
      // todo 删除 class

      const itemId = getIdByItemDom(editingItemDom)
      const item = getItemById(itemId)
      const itemInputDom = editingItemDom.querySelector('.' + classMap.el.editInput)
      const itemTextDom = editingItemDom.querySelector('.' + classMap.el.text)

      // todo update 函数如何写
      // data
      item.text = itemInputDom.value

      // view
      itemTextDom.textContent = itemInputDom.value

      editingItemDom.removeChild(itemInputDom)
      editingItemDom.classList.remove(classMap.modifier.item.edit)

    }
  }

  /**
   * 返回正在编辑的 item dom 对象
   * @return {Element | null}
   */
  function getIsEditItem() {
    return document.querySelector('.' + classMap.modifier.item.edit)

  }

  /**
   * 根据内容生成新的 input dom 对象
   * @param text
   * @return {HTMLInputElement}
   */
  function createNewInputDom(text) {
    // const inputHtml = `
    //   <input class="${classMap.el.editInput}">
    // `
    const newInput = document.createElement('input')
    newInput.classList.add(classMap.el.editInput)
    newInput.value = text
    return newInput
  }


  function getNewTodoText() {
    return input.val()
  }


  function onCheckAllBtnClick(e) {
    console.log(`**DEBUG click ckallBtn`)
    if (e.target.checked) {
      checkAll()
    } else {
      uncheckAll()
    }
  }

  function bindEvents() {
    input.focus(e => {
      window.addEventListener('keydown', onEnterDown)
    })

    input.blur(e => {
      window.removeEventListener('keydown', onEnterDown)
    })


    $(document).on('click', (e) => {
      onItemClick(e)
    })

    itemsContainer.on('dblclick', e => {
      onItemDbclick(e)
    })

    ckallBtn.on('click', onCheckAllBtnClick)

    tabsContainer.on('click', onTabClick)

    delCompletedBtn.on('click', e => {
      const completedItems = $(`.${classMap.modifier.item.completed} .${classMap.el.btnDel}`)
      completedItems.click()
      input.val('')
    })

    window.onbeforeunload = e => {
      e = e || window.event;

      saveToStorage()
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示';
      }

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示';
    }
  }



  function saveToStorage() {
    localStorage.setItem('id', String(id))
    localStorage.setItem('items', JSON.stringify(items))
  }

  function loadStorage() {
      id =  Number(localStorage.getItem('id')) || 0
      items =  JSON.parse(localStorage.getItem('items')) || []
      status.uncompletedItemsCount = getUncompletedItemsCount(items)
  }

  function restoreItemsFromStorage() {
    itemsContainer.html('')
    status.uncompletedItemsCount = getUncompletedItemsCount(items)

    for (let item of items) {
      insertItemDom(item)
    }
  }

  /**
   * 当回车键按下时
   * @param event
   */
  function onEnterDown(event) {
    if (event.key === 'Enter') {
      console.log('enter')
      addItem(getNewTodoText())
      input.val('')
    }
  }

  /**
   * 设置所有 item 为 completed 状态
   */
  function checkAll() {
    const activeItems = $(`.${classMap.block.item}:not(.${classMap.modifier.item.completed}) input.${classMap.el.ckbox}`)
    console.log(`**DEBUG checkAll activeItems:`, activeItems)
    // view & data
    activeItems.click()
  }

  function uncheckAll() {
    const completedItems = $(`.${classMap.modifier.item.completed} input.${classMap.el.ckbox}`)
    completedItems.click()
  }

  /**
   *
   * @param {Event}e
   */
  function onTabClick(e) {
    const id = e.target.getAttribute('id')
    if (id !== null) {
      setTabSelected(e.target)
      changeToTabById(id)
    }
  }

  function setTabSelected(tabDom) {
    if (tabDom) {
      const selectedClassName = classMap.modifier.footer.tabSelected
      const selectedTab = document.querySelector('.' + selectedClassName)
      if (selectedTab) {
        selectedTab.classList.remove(selectedClassName)
      }
      tabDom.classList.add(selectedClassName)
    }
  }

  /**
   * 根据选择的 tab 显示隐藏 todolist
   */
  function changeToTabById(tabId) {
    if (typeof tabId !== 'string') {
      throw new TypeError('Expected type of tabId is string, got:' + typeof tabId)
    }
    tabId = tabId.toLowerCase()

    switch (tabId) {
      case idMap.tab.active:
        itemsContainer.removeClass(classMap.modifier.container.completed)
        itemsContainer.addClass(classMap.modifier.container.active)
        break
      case idMap.tab.completed:
        itemsContainer.removeClass(classMap.modifier.container.active)
        itemsContainer.addClass(classMap.modifier.container.completed)
        break
      case idMap.tab.all:
        itemsContainer.removeClass(classMap.modifier.container.completed)
        itemsContainer.removeClass(classMap.modifier.container.active)
        break
      default:
        return
    }
  }


  function init() {
    //todo 从 localstorage 读取并恢复上次的 todomvc
    loadStorage()
    restoreItemsFromStorage()

    bindEvents()
  }

  init()
})
