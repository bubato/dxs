$(function () {
  setHeaderMargin()
  topSearch()
  seatchBtnEvt()
  toggleClass(
    '.c-btmNav-hamburgerBtn',
    ['.c-btm-hamburgerList', '.c-btmNav-hamburgerBtn'],
    'is-add',
    ['.c-btmsearchBox', '.c-btmNav-search']
  )
  gotoBackTop()
  pageInnerLink()
  LocalNavi.init()
  backBtnEvt()

  articleTableLayout()

  //matchMedia設定
  var mq = window.matchMedia('(max-width:896px)')

  // ブレイクポイントにイベント設定
  mq.addListener(lightBoxMqControl)
  // 初回チェック
  lightBoxMqControl(mq)
  /**
   *  ヘッダーページナビカレントページ制御
   */
  $('.c-header-nav a').each(function () {
    if (location.href.indexOf($(this).attr('href')) !== -1) {
      $(this).addClass('is-active')
    }
  })

  // 記事ページアンケートアニメーション
  questionnaireAnimation()
})

/**
 *  PCヘッダー検索ボタン、SPフッター検索ボタンイベント
 */
const seatchBtnEvt = function () {
  const claseLabel = '検索'
  const openLabel = '閉じる'
  toggleClass(
    '.btn-search',
    ['.l-header-searchBox', '.c-header-seatchTriggerBtn'],
    'is-open',
    []
  )
  toggleClass(
    '.c-btmNav-search',
    ['.c-btmsearchBox', '.c-btmNav-search'],
    'is-add',
    ['.c-btm-hamburgerList', '.c-btmNav-hamburgerBtn']
  )
  $('.c-header-seatchTriggerBtn').on('click', function () {
    if ($(this).hasClass('is-open')) {
      $(this).find('button').html(openLabel)
    } else {
      $(this).find('button').html(claseLabel)
    }
  })
  $('.c-btmNav-search').on('click', function () {
    if ($(this).hasClass('is-add')) {
      $(this).html(openLabel)
    } else {
      $(this).html(claseLabel)
    }
  })
}

/**
 *  戻るボタンの実装
 * リファラーが同一ドメインの場合はhistor.back
 * リファラーが別ドメインの場合はサイトトップへ戻る
 */
const backBtnEvt = function () {
  if ($('.btn-backBtn').length > 0) {
    const referrer = document.referrer
    let linkUrl = ''
    const domainText = new RegExp(location.hostname, 'i')

    $('.btn-backBtn').on('click', function (event) {
      event.preventDefault()
      if (referrer.match(domainText)) {
        //一つ前のページが同一ドメインの場合、一つ前のページへ戻る
        linkUrl = referrer
      } else {
        //トップページへ戻る
        linkUrl = '/'
      }
      location.href = linkUrl
      return false
    })
  }
}

/**
 *  ページ内リンク　アニメーション
 */
const pageInnerLink = function () {
  $('a[href^="#"]').on('click', function () {
    const adjust = $('.c-header').innerHeight()
    const speed = 400
    const href = $(this).attr('href')
    const target = $(href == '#' || href == '' ? 'html' : href)
    const position = target.offset().top - adjust
    $('body,html').animate({ scrollTop: position }, speed, 'swing')
    return false
  })
}
/**
 *  matchMediaにて記事ページの画像のライトボックス制御
 * 　PCはライトボックスなし
 * 　SPはライトボックスあり
 * 　制御方法はaタグrelとhrefの画像URLの変更
 */
const lightBoxMqControl = function (mq) {
  if (mq.matches) {
    //SP向け
    // 記事ページのみ
    if ($('.l-articleTemplate-section').length > 0) {
      $('.l-articleTemplate-section.is-image img').each(function () {
        $(this)
          .parent('a')
          .attr('rel', 'lightbox')
          .attr('href', $(this).attr('src'))
      })
    }
  } else {
    // PC向け
    // 記事ページのみ
    if ($('.l-articleTemplate-section').length > 0) {
      $('.l-articleTemplate-section.is-image img').each(function () {
        $(this).parent('a').attr('rel', '').attr('href', 'javascript:void(0)')
      })
    }
  }
}

/**
 *  ページトップへ戻る
 */
const gotoBackTop = function () {
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 10) {
      $('.btn-pgTop').addClass('is-visible')
    } else {
      $('.btn-pgTop').removeClass('is-visible')
    }
  })
  $('.btn-pgTop a').on('click', function () {
    $('body,html').animate(
      {
        scrollTop: 0,
      },
      500
    )
    return false
  })
}

/**
 *  PC トップページ閾値までスクロールでボタンの表示
 */
const topSearch = function () {
  const triggerEml = '.l-forFirst'
  const toggleClassTargetElm = '.c-header-seatchTriggerBtn'
  const toggleClassName = 'is-add'
  const searchBoxElm = '.l-header-searchBox'
  const searchBoxOpenClassName = 'is-open'
  if ($(triggerEml).length <= 0) {
    $(toggleClassTargetElm).addClass(toggleClassName)
    return
  }
  $(window).on('scroll', function () {
    if ($(triggerEml).offset().top > $(this).scrollTop()) {
      $(toggleClassTargetElm).removeClass(toggleClassName)
      $(searchBoxElm).removeClass(searchBoxOpenClassName)
    } else {
      $(toggleClassTargetElm).addClass(toggleClassName)
    }
  })
}

/**
 *  PC header高さ分コンテンツを下げる
 */
const setHeaderMargin = function () {
  const headerH = $('.c-header').innerHeight()
  const headerNextDom = $('header').next()
  headerNextDom.css('margin-top', headerH + 'px')
}

/**
 *  PC header高さ分コンテンツを下げる
 *  @param {string} btn
 *  @param {[string,string…]} toggleTargetElm
 *  @param {string} toggleClassName
 *  @param {[[string,string…]]} toggleElemntClassName //対になるクラスがある場合は配列指定
 */
const toggleClass = function (
  btn,
  toggleTargetElm,
  toggleClassName,
  toggleElemntClassName
) {
  $(btn).on('click', function () {
    if ($(toggleTargetElm[0]).hasClass(toggleClassName)) {
      for (elm in toggleTargetElm) {
        $(toggleTargetElm[elm]).removeClass(toggleClassName)
      }
    } else {
      if (toggleElemntClassName.length > 0) {
        for (elm in toggleElemntClassName) {
          $(toggleElemntClassName[elm]).removeClass(toggleClassName)
        }
      }
      for (elm in toggleTargetElm) {
        $(toggleTargetElm[elm]).addClass(toggleClassName)
      }
    }
  })
}

/**
 *  ローカルナビ
 */
const LocalNavi = {
  className: {
    header: '.c-header',
    aside: '.l-aside',
    asideNav: '.l-aside-nav',
    asideInner: '.l-aside-inner',
    asideNavTitle: '.l-aside-nav-title',
    asideInnerListWrap: '.l-aside-nav-innerListWrap',
    asideInnerListWrapUl: '.l-aside-nav-innerListWrap ul',
  },
  sttSetting: {
    isFix: 'is-fix',
    isOpen: 'is-open',
    isCurrent: 'is-current',
    triggerElmtop: 0,
  },
}
/**
 *  ローカルナビ初期設定
 */
LocalNavi.init = function () {
  if ($(LocalNavi.className.asideNav).length > 0) {
    LocalNavi.siblingsToggleClass()
    LocalNavi.sttSetting.triggerElmtop =
      $(LocalNavi.className.aside).offset().top -
      $(LocalNavi.className.header).height()

    // 初期表示時アクティブ指定
    LocalNavi.setCurrentPage()
    $(window).on('scroll', function () {
      if (LocalNavi.sttSetting.triggerElmtop > $(window).scrollTop()) {
        $(LocalNavi.className.aside).css('height', 'auto')
        $(LocalNavi.className.aside).removeClass(LocalNavi.sttSetting.isFix)
      } else {
        $(LocalNavi.className.aside).css(
          'height',
          $(LocalNavi.className.asideInner).height() + 'px'
        ) // ローカルナビのpositionをfixにすると右側コンテンツよりローカルナビの方が長い場合、ちらつきが発生するため、高さの調整
        $(LocalNavi.className.aside).addClass(LocalNavi.sttSetting.isFix)
        $(
          '.' +
            LocalNavi.sttSetting.isFix +
            ' ' +
            LocalNavi.className.asideInner
        ).css('left', getLeftPosition())
      }
    })
    $(window).resize(function () {
      $(
        '.' + LocalNavi.sttSetting.isFix + ' ' + LocalNavi.className.asideInner
      ).css('left', getLeftPosition())
      LocalNavi.sttSetting.triggerElmtop =
        $(LocalNavi.className.aside).offset().top -
        $(LocalNavi.className.header).height()
    })

    const getLeftPosition = function () {
      return $(LocalNavi.className.aside).offset().left + 'px'
    }
  }
}

/**
 *  ローカルナビアコーディオンを開く
 *  @param {jqueryObject}} elm
 */
LocalNavi.setNaviOpen = function (elm) {
  let count = 0
  $(elm)
    .parent(LocalNavi.className.asideNav)
    .find(LocalNavi.className.asideInnerListWrapUl)
    .each(function () {
      count += $(this).find('li').length
    })
  $(elm)
    .parent(LocalNavi.className.asideNav)
    .find(LocalNavi.className.asideInnerListWrap)
    .css('max-height', count * 300 + 'px')
  $(elm)
    .parent(LocalNavi.className.asideNav)
    .addClass(LocalNavi.sttSetting.isOpen)
}
/**
 *  ローカルナビアコーディオンを閉じる
 *  @param {jqueryObject}} elm
 */
LocalNavi.setNaviClose = function (elm) {
  $(elm)
    .parent(LocalNavi.className.asideNav)
    .removeClass(LocalNavi.sttSetting.isOpen)
  $(elm)
    .parent(LocalNavi.className.asideNav)
    .find(LocalNavi.className.asideInnerListWrap)
    .css('max-height', '0')
}
/**
 *  ローカルナビアコーディオンボタンクリック時の動作制御
 */
LocalNavi.siblingsToggleClass = function () {
  $(LocalNavi.className.asideNav + ' ' + LocalNavi.className.asideNavTitle).on(
    'click',
    function () {
      if (
        $(this)
          .parent(LocalNavi.className.asideNav)
          .hasClass(LocalNavi.sttSetting.isOpen)
      ) {
        LocalNavi.setNaviClose(this)
      } else {
        LocalNavi.setNaviOpen(this)
      }
    }
  )
}
/**
 *  ローカルナビカレントページ制御
 */
LocalNavi.setCurrentPage = function () {
  $(LocalNavi.className.asideNav + ' a').each(function () {
    if ($(this).attr('href') === location.pathname) {
      $(this).addClass(LocalNavi.sttSetting.isCurrent)
      LocalNavi.setNaviOpen(
        $(this)
          .parents(LocalNavi.className.asideNav)
          .find(LocalNavi.className.asideNavTitle)
      )
    }
  })
}
/**
 *  記事ページ表1番目、rowspan時でも白と灰色の縞模様になるようクラスを追加
 *  記事ページのみ利用
 */
const articleTableLayout = function () {
  $('.l-articleTemplate-section-table').each(function () {
    const cellMaxLength = $(this).find('thead th').length
    let addCount = 0
    let className = ''
    $(this)
      .find('tbody tr')
      .each(function () {
        if (cellMaxLength == $(this).find('td').length && addCount % 2 == 1) {
          $(this).find('td').eq(0).addClass('gray')
          addCount++
        } else if (
          cellMaxLength == $(this).find('td').length &&
          addCount % 2 == 0
        ) {
          $(this).find('td').eq(0).addClass('white')
          addCount++
        }
      })
  })
}

/**
 *  記事ページアンケートアニメーション
 */
const questionnaireAnimation = function () {
  $('.box-logStrage .btn').on('click', function () {
    var boxH = $('.box-logStrage').height()
    $('.box-logStrage').addClass('is-selected')
    $('.box-logStrage *').on('transitionend webkitTransitionEnd', function () {
      $('.box-logStrage').css('height', boxH + 'px')
      $('.box-logStrage-select').remove()
      $('.box-logStrage').append(
        '<p class="thanks">ご回答ありがとうございました。<br>貴重なご意見はサービスの改善に活用させていただきます。</p>'
      )
    })
  })
}

/**
 *  サイドナビ
 */
$(window).scroll(function () {
  var scrollY = $(this).scrollTop()
  if (scrollY < $('.c-header').height()) {
    $('#sidemenu').removeClass('is-fixed2')
    $('#sidemenu').addClass('is-fixed')
  } else {
    $('#sidemenu').removeClass('is-fixed')
    $('#sidemenu').addClass('is-fixed2')
  }
})
