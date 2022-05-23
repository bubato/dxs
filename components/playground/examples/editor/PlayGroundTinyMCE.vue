<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="editorValue"></div>
    <Editor
      ref="editor"
      v-model="editorValue"
      :api-key="apikey"
      :init="init"
    ></Editor>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'WysiwygEditor',
  components: {
    Editor,
  },
  data() {
    return {
      editorValue: '',
      selector: '',
      apikey: 'd65wg0ri0htywl7ebkmyujocziknbn6nlou8jic3o7j2m9ss',
      init: {
        language: 'ja',
        branding: false,
        height: 300,
        forced_root_block: false,
        /**
         * メニューバーの表示・非表示
         */
        menubar: false,
        /**
         * テーブルのツールバー
         */
        // table_toolbar: [
        //   'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
        // ],
        /**
         * プラグイン
         */
        // plugins: [
        //   'print preview fullpage importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons code',
        // ],
        plugins: ['code'],
        /**
         * ツールバー
         */
        // toolbar: [
        //   'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help table | code',
        // ],
        toolbar: ['code'],
        /**
         * TinyMCEを拡張する
         */
        setup(editor) {
          // アイコンのカスタマイズ
          editor.ui.registry.addIcon(
            'book',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>'
          )
          // コンテキストメニューのカスタマイズ
          editor.ui.registry.addMenuItem('myContextMenu', {
            icon: 'book',
            text: '定型文1',
            context: 'tools',
            // メソッドを登録
            onAction() {
              editor.insertContent(
                '<ul><li>定型文1定型文1定型文1定型文1定型文1定型文1</li><li>定型文1定型文1定型文1定型文1定型文1定型文1</li><li>定型文1定型文1定型文1定型文1定型文1定型文1</li></ul>'
              )
            },
          })
          editor.ui.registry.addMenuItem('myContextDropDownMenu', {
            icon: 'book',
            text: '定型文2',
            // メソッドを登録
            onAction() {
              editor.insertContent(
                '<ul><li>定型文2定型文2定型文2定型文2定型文2定型文2</li><li>定型文2定型文2定型文2定型文2定型文2定型文2</li><li>定型文2定型文2定型文2定型文2定型文2定型文2</li></ul>'
              )
            },
          })
          editor.ui.registry.addNestedMenuItem('nesteditem', {
            text: 'ドロップダウンメニュー',
            getSubmenuItems() {
              return [
                {
                  type: 'menuitem',
                  text: '子メニュー1',
                  onAction() {
                    editor.insertContent('<p>子メニュー1</p>')
                  },
                },
                {
                  type: 'menuitem',
                  text: '子メニュー2',
                  onAction() {
                    editor.insertContent('<p>子メニュー2</p>')
                  },
                  getSubmenuItems() {
                    return [
                      {
                        type: 'menuitem',
                        text: '子メニュー2-1',
                        onAction() {
                          editor.insertContent('<p>子メニュー2-1</p>')
                        },
                      },
                      {
                        type: 'menuitem',
                        text: '子メニュー2-2',
                        onAction() {
                          editor.insertContent('<p>子メニュー2-2</p>')
                        },
                      },
                    ]
                  },
                },
              ]
            },
          })
          // https://www.tiny.cloud/docs/ui-components/contexttoolbar/#determiningthedisplaypriorityofcontexttoolbarsandcontextforms
          // editor.ui.registry.addContextToolbar('textselection', {
          //   predicate(node) {
          //     return !editor.selection.isCollapsed()
          //   },
          //   items: '',
          //   position: 'selection',
          //   scope: 'node',
          // })
          editor.ui.registry.addContextToolbar('addTextLink', {
            predicate(node) {
              return node.nodeName.toLowerCase() === 'body'
            },
            items: 'alignleft aligncenter alignright | myContextMenu',
            position: 'selection',
            scope: 'editor',
          })
        },
        /**
         * 使用できるタグを制限する
         */
        // valid_elements: 'p,a,span,br,b',
        /**
         * 表示されるコンテキストメニューのカスタマイズ
         */
        contextmenu: 'myContextMenu myContextDropDownMenu nesteditem',
      },
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
