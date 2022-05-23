<template>
  <div class="main">
    <div class="select_items">
      <ul>
        <li :class="{ active: selectItem === '' }" @click="selectItem = ''">
          すべて
        </li>
        <li
          v-for="(items, key) in parts"
          :key="key"
          :class="{ active: selectItem === key }"
          @click="selectItem = key"
        >
          {{ key }}
        </li>
        <li
          :class="{ active: selectItem === 'table' }"
          @click="selectItem = 'table'"
        >
          テーブル
        </li>
        <li
          :class="{ active: selectItem === 'form' }"
          @click="selectItem = 'form'"
        >
          フォーム
        </li>
        <li
          :class="{ active: selectItem === 'svg' }"
          @click="selectItem = 'svg'"
        >
          SVG
        </li>
        <li
          :class="{ active: selectItem === 'editor' }"
          @click="selectItem = 'editor'"
        >
          エディタ
        </li>
        <li
          :class="{ active: selectItem === 'validation' }"
          @click="selectItem = 'validation'"
        >
          バリデーション
        </li>
        <li
          :class="{ active: selectItem === 'toolTipAndAreaLabel' }"
          @click="selectItem = 'toolTipAndAreaLabel'"
        >
          ツールチップ・エリアラベル
        </li>
      </ul>
    </div>
    <div v-for="(items, key1) in filterParts" :key="key1" class="font-parts">
      <h2>{{ key1 }}</h2>
      <div v-for="(list, key2) in items" :key="key2">
        <h3>{{ key2 }}</h3>
        <table>
          <thead>
            <tr>
              <th class="item">項目</th>
              <th class="sample">サンプル</th>
              <th class="class">class</th>
              <th class="structure">構造</th>
              <th v-if="styleView" class="style">style</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index1) in list" :key="index1">
              <td class="item">{{ data.item }}</td>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td class="sample" v-html="data.structure"></td>
              <td class="class">{{ data.class }}</td>
              <td class="structure">
                <pre>{{ data.structure }}</pre>
              </td>
              <td v-if="styleView" class="style">
                <ul>
                  <li v-for="(style, index2) in data.styles" :key="index2">
                    {{ style }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- form -->
    <div v-if="selectItem === 'form' || selectItem === ''" class="form-parts">
      <h2>フォーム</h2>
      <div>
        <h3>input</h3>
        <table>
          <thead>
            <tr>
              <th class="item">項目</th>
              <th class="sample">サンプル</th>
              <th class="structure">構造</th>
              <th class="other">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="item">input</td>
              <td class="sample">
                <CustomInputText
                  v-model="inputText"
                  placeholder="サンプル"
                  :validation="validationInput"
                />
              </td>
              <td class="structure">
                &lt;CustomInputText v-model=&quot;inputText&quot;
                placeholder=&quot;サンプル&quot;
                :validation=&quot;validationInput&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・placeholder(placeholder属性) ・viewType(search) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">input(search)</td>
              <td class="sample">
                <CustomInputText
                  v-model="inputSearchText"
                  placeholder="サンプル"
                  view-type="search"
                  :validation="validationInput"
                />
              </td>
              <td class="structure">
                &lt;CustomInputText v-model=&quot;inputSearchText&quot;
                placeholder=&quot;サンプル&quot; view-type=&quot;search&quot;
                :validation=&quot;validationInput&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・placeholder(placeholder属性) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">select</td>
              <td class="sample">
                <CustomInputSelect
                  v-model="selectVal"
                  :options="options"
                  placeholder="選択して下さい"
                  :validation="validationSelect"
                />
                <p>value:{{ selectVal }}</p>
              </td>
              <td class="structure">
                &lt;CustomInputSelect v-model=&quot;selectVal&quot;
                :options=&quot;options&quot;
                placeholder=&quot;選択して下さい&quot;
                :validation=&quot;validationSelect&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・options(選択肢)★ <br />
                  ・placeholder(placeholder属性) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">textarea</td>
              <td class="sample">
                <CustomInputTextarea
                  v-model="inputTextArea"
                  :placeholder="inputTextAreaPlaceholder"
                  :validation="validationInputTextarea"
                />
              </td>
              <td class="structure">
                &lt;CustomInputTextarea v-model=&quot;inputTextArea&quot;
                :placeholder=&quot;inputTextAreaPlaceholder&quot;
                :validation=&quot;validationInputTextarea&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・placeholder(placeholder属性) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">radio</td>
              <td class="sample">
                <CustomInputRadio
                  v-model="inputRadio"
                  :options="radioOptions"
                  name="inputRadio"
                  layout-type="vertical"
                  :validation="validationInputRadio"
                />
                <p>value:{{ inputRadio }}</p>
              </td>
              <td class="structure">
                &lt;CustomInputRadio v-model=&quot;inputRadio&quot;
                :options=&quot;radioOptions&quot; name=&quot;inputRadio&quot;
                layout-type=&quot;vertical&quot;
                :validation=&quot;validationInputRadio&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・options(選択肢)★ <br />
                  ・name(name属性)★ <br />
                  ・layout-type('vertical'を入れると縦に並ぶ) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">checkbox</td>
              <td class="sample">
                <CustomInputCheckbox
                  v-model="inputCheckbox"
                  :options="checkboxOptions"
                  name="inputCheckbox"
                  :validation="validationInputCheckbox"
                />
                <p>value:{{ inputCheckbox }}</p>
              </td>
              <td class="structure">
                &lt;CustomInputCheckbox v-model=&quot;inputCheckbox&quot;
                :options=&quot;checkboxOptions&quot;
                name=&quot;inputCheckbox&quot;
                :validation=&quot;validationInputCheckbox&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・options(選択肢)★ <br />
                  ・name(name属性)★ <br />
                  ・layout-type('vertical'を入れると縦に並ぶ) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>

            <tr>
              <td class="item">addBlockItem</td>
              <td class="sample">
                <div class="buttons">
                  <button
                    v-for="(button, index) in buttons"
                    :key="index"
                    class="btn btn-primary btn-middle"
                  >
                    {{ button.label }}
                  </button>
                </div>
                <AddBlockItem @addItem="additem()" />
              </td>
              <td class="structure">
                &lt;AddBlockItem @addItem=&quot;additem()&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・addItem(関数)<br />
                  ボタンが押されたかどうかの検知
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">AddItem</td>
              <td class="sample">
                <div class="buttons">
                  <button
                    v-for="(button, index) in buttons2"
                    :key="index"
                    class="btn btn-primary btn-middle"
                  >
                    {{ button.label }}
                  </button>
                </div>
                <AddItem
                  label="項目を追加"
                  class="margin-t-16"
                  @additem="additem2()"
                />
              </td>
              <td class="structure">
                &lt;AddItem label="項目を追加" class="margin-t-16"
                @addItem="addOfficer()" /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・addItem(関数)<br />
                  ボタンが押されたかどうかの検知
                </p>
              </td>
            </tr>

            <tr>
              <td class="item">FileUpload</td>
              <td class="sample">
                <FileUpload @uploaded="upload($event)" />
              </td>
              <td class="structure">
                &lt;FileUpload @uploaded=&quot;upload($event)&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・uploaded(関数)<br />
                  引数にファイルの情報がファイル型で返ってくる。
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">datepicker</td>
              <td class="sample">
                <div class="custom_date_picker">
                  <CustomDatePicker v-model="selectDays" />
                  <CustomSelectHours v-model="selectHours" />
                  <CustomSelectMinutes v-model="selectMinutes" />
                </div>
                <p>days:{{ selectDays }}</p>
                <p>hours:{{ selectHours }}</p>
                <p>minutes:{{ selectMinutes }}</p>
              </td>
              <td class="structure">
                &lt;custom-date-picker v-model=&quot;selectDays&quot; /&gt;
                <br />
                &lt;CustomSelectHours v-model=&quot;selectHours&quot; /&gt;
                <br />
                &lt;CustomSelectMinutes v-model=&quot;selectMinutes&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model <br />
                  日の定義と時分の定義は別で行う
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">dateRangepicker（範囲選択可能）</td>
              <td class="sample">
                <CustomDateRangePicker
                  v-model="dateRangePicker"
                  :start-date="dateRangePicker.startDate"
                  :end-date="dateRangePicker.endDate"
                  :opens="'right'"
                  @update="updateDateRangePicker($event)"
                />
                <div>
                  {{ dateRangePicker }}
                </div>
              </td>
              <td class="structure">
                &lt;CustomDateRangePicker v-model=&quot;dateRangePicker&quot;
                :start-date=&quot;dateRangePicker.startDate&quot;
                :end-date=&quot;dateRangePicker.endDate&quot;
                :opens=&quot;'right'&quot;
                @update=&quot;updateDateRangePicker($event)&quot; /&gt;
                <br />
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model（object）<br />
                  ・:start-date=（string: YYYY/MM/DD）<br />
                  ・:end-date=（string:YYYY/MM/DD）<br />
                  ・:opens（ドロップダウン表示位置）【string: 'center', 'right',
                  'left', 'inline'】 <br />
                  ・@update（event）
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">アイコン付き疑似セレクトボックス</td>
              <td class="sample">
                <div class="custom_date_picker">
                  <PseudoSelectBox
                    v-model="pseudoSelectBoxValues"
                    :options="pseudoSelectBoxOptions"
                    class=""
                    @changeOption="pseudoSelectBoxValues = $event"
                  />
                </div>
                <p>value: {{ pseudoSelectBoxValues }}</p>
              </td>
              <td class="structure">
                &lt;PseudoSelectBox v-model=&quot;pseudoSelectBoxValues&quot;
                /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">number</td>
              <td class="sample">
                <CustomInputNumber
                  v-model="inputNumber"
                  placeholder="012345"
                  :validation="validationInput"
                />
              </td>
              <td class="structure">
                &lt;CustomInputNumber v-model=&quot;inputText&quot;
                placeholder=&quot;サンプル&quot;
                :validation=&quot;validationInput&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・placeholder(placeholder属性) ・viewType(search) <br />
                  ・validation(バリデーション情報:配列) ・min(値)<br />
                  ・max(値)<br />
                  ・maxlength(値) <br />
                  ・viewType(String:'search'指定にて検索表示)<br />
                  ・isDisabled(Boolean)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">tel(電話番号)</td>
              <td class="sample">
                <CustomInputTel
                  v-model="inputTel"
                  placeholder="0300000000"
                  :validation="validationInput"
                />
              </td>
              <td class="structure">
                &lt;CustomInputTel v-model=&quot;inputText&quot;
                placeholder=&quot;サンプル&quot;
                :validation=&quot;validationInput&quot; /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す <br />
                  ・v-model(値)★ <br />
                  ・placeholder(placeholder属性) ・viewType(search) <br />
                  ・validation(バリデーション情報:配列)
                </p>
              </td>
            </tr>
            <tr>
              <td class="item">カスタムカラーピッカー</td>
              <td class="sample">
                <CustomColorPicker />
              </td>
              <td class="structure">&lt;CustomColorPicker /&gt;</td>
              <td class="other">
                <p></p>
              </td>
            </tr>
            <tr>
              <td class="item">Password</td>
              <td class="sample">
                <CustomInputPassword
                  v-model="password"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'password').validation
                  "
                />
              </td>
              <td class="structure">
                &lt;CustomInputPassword v-model="password" :validation="
                $common.getFormItemsDetail(formItems, 'password').validation "
                /&gt;
              </td>
              <td class="other">
                <p></p>
              </td>
            </tr>
            <tr>
              <td class="item">Password</td>
              <td class="sample">
                <CustomInputPassword
                  v-model="password"
                  :validation="
                    $common.getFormItemsDetail(formItems, 'password').validation
                  "
                />
              </td>
              <td class="structure">
                &lt;CustomInputPassword v-model="password" :validation="
                $common.getFormItemsDetail(formItems, 'password').validation "
                /&gt;
              </td>
              <td class="other">
                <p></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- table -->
    <div v-if="selectItem === 'table' || selectItem === ''" class="table-parts">
      <div>
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th class="sample">サンプル</th>
              <th class="structure">構造</th>
              <th class="other">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="sample">
                <SelectSearchResult
                  :select-search-result-type="
                    tableOption.selectSearchResultType
                  "
                  :search-result-all="tableOption.searchResultAll"
                  :search-result-filter="tableOption.searchResultFilter"
                  @changeSelectSearchResult="changeSelectSearchResult($event)"
                />
              </td>
              <td class="structure">
                &lt;SelectSearchResult :select-search-result-type=&quot;
                tableOption.selectSearchResultType &quot;
                :search-result-all=&quot;tableOption.searchResultAll&quot;
                :search-result-filter=&quot;tableOption.searchResultFilter&quot;
                @changeSelectSearchResult=&quot;changeSelectSearchResult($event)&quot;
                /&gt;
              </td>
              <td class="other">
                下記を引数にコンポーネントを呼び出す<br />
                ・:select-search-result('all' or 'filter')<br />
                ・:search-result-all(すべての件数)<br />
                ・:search-result-filter(検索結果の件数)<br />
                ・@changeSelectSearchResult(すべて←→検索結果切り替え時に呼び出す関数)
              </td>
            </tr>
            <tr>
              <td class="sample">
                <SearchWordList
                  :search-word-list="tableOption.searchWordList"
                  @deleteSearchWord="deleteSearchWord($event)"
                />
              </td>
              <td class="structure">
                &lt;SearchWordList
                :search-word-list=&quot;tableOption.searchWordList&quot;
                @deleteSearchWord=&quot;deleteSearchWord($event)&quot; /&gt;
              </td>
              <td class="other">
                下記を引数にコンポーネントを呼び出す<br />
                ・:search-word-list(検索条件のリスト)<br />
                ・@deleteSearchWord(検索条件削除時に呼び出す関数)<br />
              </td>
            </tr>
            <tr>
              <td class="sample">
                <ShowTableType
                  :show-table-type="tableOption.showTableType"
                  @changeShowTableType="changeShowTableType($event)"
                />
              </td>
              <td class="structure">
                &lt;ShowTableType
                :show-table-type=&quot;tableOption.showTableType&quot;
                @changeShowTableType=&quot;changeShowTableType($event)&quot;
                /&gt;
              </td>
              <td class="other">
                下記を引数にコンポーネントを呼び出す<br />
                ・:show-table-type(テーブルの表示タイプ。'table' or 'list')<br />
                ・@changeShowTableType(テーブルの表示タイプ変更時に呼び出す関数)<br />
              </td>
            </tr>
            <tr>
              <td class="sample">
                <SettingShowNum
                  :setting-show-num="tableOption.settingShowNum"
                  @update="updateSettingShowNum($event)"
                />
              </td>
              <td class="structure">
                &lt;SettingShowNum
                :setting-show-num=&quot;tableOption.settingShowNum&quot;
                @update=&quot;updateSettingShowNum($event)&quot; /&gt;
              </td>
              <td class="other">
                下記を引数にコンポーネントを呼び出す<br />
                ・:setting-show-num(表示件数 20 or 50 or 100)<br />
                ・@update(表示件数変更時に呼び出す関数)<br />
              </td>
            </tr>
            <tr>
              <td class="sample">
                <PageNav
                  :current-page="tableOption.currentPage"
                  :setting-show-num="tableOption.settingShowNum"
                  :max-data-num="tableOption.maxDataNum"
                  @showPrevPage="showPrevPage()"
                  @showNextPage="showNextPage()"
                />
              </td>
              <td class="structure">
                &lt;PageNav :current-page=&quot;tableOption.currentPage&quot;
                :setting-show-num=&quot;tableOption.settingShowNum&quot;
                :max-data-num=&quot;tableOption.maxDataNum&quot;
                @showPrevPage=&quot;showPrevPage()&quot;
                @showNextPage=&quot;showNextPage()&quot; /&gt;
              </td>
              <td class="other">
                下記を引数にコンポーネントを呼び出す<br />
                ・:current-page(ページング情報)<br />
                ・:setting-show-num(表示件数 20 or 50 or 100)<br />
                ・:max-data-num(全データ数)<br />
                ・@showPrevPage(前ページ移動ボタン押下時に呼び出す関数)<br />
                ・@showNextPage(次ページ移動ボタン押下時に呼び出す関数)<br />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- SVG -->
    <div v-if="selectItem === 'svg' || selectItem === ''" class="svg-parts">
      <div>
        <h2>SVG</h2>

        <table>
          <thead>
            <tr>
              <th class="sample">サンプル</th>
              <th class="structure">構造</th>
              <th class="cursor">cursor設定</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="sample"><HomeSVG class="icon-home" /></td>
              <td class="structure">&lt;HomeSVG class="icon-home" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample">
                <NotificationsSVG class="icon-notifications" />
              </td>
              <td class="structure">
                &lt;NotificationsSVG class="icon-notifications" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <UnreadNotificationsSVG class="icon-unreadNotifications" />
              </td>
              <td class="structure">
                &lt;UnreadNotificationsSVG class="icon-unreadNotifications"
                /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <AccountCircleSVG class="icon-accountCircle" />
              </td>
              <td class="structure">
                &lt;AccountCircleSVG class="icon-accountCircle" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample">
                <KeyBoardTabSVG class="icon-keyBoardTab" />
              </td>
              <td class="structure">
                &lt;KeyBoardTabSVG class="icon-keyBoardTab" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><MenuSVG class="icon-menu" /></td>
              <td class="structure">&lt;MenuSVG class="icon-menu" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><DehazeSVG class="icon-dehaze" /></td>
              <td class="structure">&lt;DehazeSVG class="icon-dehaze" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><AppsSVG class="icon-apps" /></td>
              <td class="structure">&lt;AppsSVG class="icon-apps" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <FormatListBulletedSVG class="icon-formatListBulleted" />
              </td>
              <td class="structure">
                &lt;FormatListBulletedSVG class="icon-formatListBulleted" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <ArrowUpwardSVG class="icon-arrowUpward" />
              </td>
              <td class="structure">
                &lt;ArrowUpwardSVG class="icon-arrowUpward" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <ArrowForwardSVG class="icon-arrowForward" />
              </td>
              <td class="structure">
                &lt;ArrowForwardSVG class="icon-arrowForward" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <ArrowDownwardSVG class="icon-arrowDownward" />
              </td>
              <td class="structure">
                &lt;ArrowDownwardSVG class="icon-arrowDownward" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><ExpandLessSVG class="icon-expandLess" /></td>
              <td class="structure">
                &lt;ExpandLessSVG class="icon-expandLess" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><ExpandMoreSVG class="icon-expandMore" /></td>
              <td class="structure">
                &lt;ExpandMoreSVG class="icon-expandMore" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <KeyboardArrowRightSVG class="icon-keyboardArrowRight" />
              </td>
              <td class="structure">
                &lt;KeyboardArrowRightSVG class="icon-keyboardArrowRight" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <ArrowDropUpSVG class="icon-arrowDropUp" />
              </td>
              <td class="structure">
                &lt;ArrowDropUpSVG class="icon-arrowDropUp" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <ArrowDropDownSVG class="icon-arrowDropDown" />
              </td>
              <td class="structure">
                &lt;ArrowDropDownSVG class="icon-arrowDropDown" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><PushPinSVG class="icon-pushPin" /></td>
              <td class="structure">
                &lt;PushPinSVG class="icon-pushPin" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><SettingsSVG class="icon-settings" /></td>
              <td class="structure">
                &lt;SettingsSVG class="icon-settings" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><StarSVG class="icon-star" /></td>
              <td class="structure">&lt;StarSVG class="icon-star" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <StarOutlineSVG class="icon-starOutline" />
              </td>
              <td class="structure">
                &lt;StarOutlineSVG class="icon-starOutline" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><CalendarSVG class="icon-calendar" /></td>
              <td class="structure">
                &lt;CalendarSVG class="icon-calendar" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><AddCircleSVG class="icon-addCircle" /></td>
              <td class="structure">
                &lt;AddCircleSVG class="icon-addCircle" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><CancelSVG class="icon-cancel" /></td>
              <td class="structure">&lt;CancelSVG class="icon-cancel" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><ErrorSVG class="icon-error" /></td>
              <td class="structure">&lt;ErrorSVG class="icon-error" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <CheckCircleSVG class="icon-checkCircle" />
              </td>
              <td class="structure">
                &lt;CheckCircleSVG class="icon-checkCircle" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <RemoveCircleSVG class="icon-removeCircle" />
              </td>
              <td class="structure">
                &lt;RemoveCircleSVG class="icon-removeCircle" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><HelpSVG class="icon-help" /></td>
              <td class="structure">&lt;HelpSVG class="icon-help" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><WarningSVG class="icon-warning" /></td>
              <td class="structure">
                &lt;WarningSVG class="icon-warning" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><LaunchSVG class="icon-launch" /></td>
              <td class="structure">&lt;LaunchSVG class="icon-launch" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><OpenInNewSVG class="icon-openInNew" /></td>
              <td class="structure">
                &lt;OpenInNewSVG class="icon-openInNew" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><SearchSVG class="icon-search" /></td>
              <td class="structure">&lt;SearchSVG class="icon-search" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><CloseSVG class="icon-close" /></td>
              <td class="structure">&lt;CloseSVG class="icon-close" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>

            <tr>
              <td class="sample"><PageviewSVG class="icon-pageview" /></td>
              <td class="structure">
                &lt;PageviewSVG class="icon-pageview" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><CheckSVG class="icon-check" /></td>
              <td class="structure">&lt;CheckSVG class="icon-check" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><AttachFileSVG class="icon-attachFile" /></td>
              <td class="structure">
                &lt;AttachFileSVG class="icon-attachFile" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><PublicSVG class="icon-public" /></td>
              <td class="structure">&lt;PublicSVG class="icon-public" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><CameraAltSVG class="icon-cameraAlt" /></td>
              <td class="structure">
                &lt;CameraAltSVG class="icon-cameraAlt" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <FormatAlignLeftSVG class="icon-formatAlignLeft" />
              </td>
              <td class="structure">
                &lt;FormatAlignLeftSVG class="icon-formatAlignLeft" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <FormatAlignCenterSVG class="icon-formatAlignCenter" />
              </td>
              <td class="structure">
                &lt;FormatAlignCenterSVG class="icon-formatAlignCenter" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <FormatAlignRightSVG class="icon-formatAlignRight" />
              </td>
              <td class="structure">
                &lt;FormatAlignRightSVG class="icon-formatAlignRight" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample"><MoreHorizSVG class="icon-moreHoriz" /></td>
              <td class="structure">
                &lt;MoreHorizSVG class="icon-moreHoriz" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><LockSVG class="icon-lock" /></td>
              <td class="structure">&lt;LockSVG class="icon-lock" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <SupervisorAccountSVG class="icon-supervisorAccount" />
              </td>
              <td class="structure">
                &lt;SupervisorAccountSVG class="icon-supervisorAccount" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><ReplaySVG class="icon-replay" /></td>
              <td class="structure">&lt;ReplaySVG class="icon-replay" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><DeleteSVG class="icon-delete" /></td>
              <td class="structure">&lt;DeleteSVG class="icon-delete" /&gt;</td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <DeleteForeverSVG class="icon-deleteForever" />
              </td>
              <td class="structure">
                &lt;DeleteForeverSVG class="icon-deleteForever" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample"><EditSVG class="icon-edit" /></td>
              <td class="structure">&lt;EditSVG class="icon-edit" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><CreateSVG class="icon-create" /></td>
              <td class="structure">&lt;CreateSVG class="icon-create" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample"><WatchLaterSVG class="icon-watchLater" /></td>
              <td class="structure">
                &lt;WatchLaterSVG class="icon-watchLater" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample">
                <AccessTimeFilledSVG class="icon-accessTimeFilled" />
              </td>
              <td class="structure">
                &lt;AccessTimeFilledSVG class="icon-accessTimeFilled" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><ComputerSVG class="icon-computer" /></td>
              <td class="structure">
                &lt;ComputerSVG class="icon-computer" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><PcSVG class="icon-pc" /></td>
              <td class="structure">&lt;PcSVG class="icon-pc" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><SmartPhoneSVG class="icon-smartPhone" /></td>
              <td class="structure">
                &lt;SmartPhoneSVG class="icon-smartPhone" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample"><CommentSVG class="icon-comment" /></td>
              <td class="structure">
                &lt;CommentSVG class="icon-comment" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample gray">
                <SpeechBalloonSVG class="icon-speechBalloon" />
              </td>
              <td class="structure">
                &lt;SpeechBalloonSVG class="icon-speechBalloon" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><SendSVG class="icon-send" /></td>
              <td class="structure">&lt;SendSVG class="icon-send" /&gt;</td>
              <td class="cursor">なし</td>
            </tr>
            <tr>
              <td class="sample"><DownloadSVG class="icon-download" /></td>
              <td class="structure">
                &lt;DownloadSVG class="icon-download" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>

            <tr>
              <td class="sample"><VisibilitySVG class="icon-visibility" /></td>
              <td class="structure">
                &lt;VisibilitySVG class="icon-visibility" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <VisibilityOffSVG class="icon-visibilityOff" />
              </td>
              <td class="structure">
                &lt;VisibilityOffSVG class="icon-visibilityOff" /&gt;
              </td>
              <td class="cursor">あり</td>
            </tr>
            <tr>
              <td class="sample">
                <AttentionSVG class="icon-attention" />
              </td>
              <td class="structure">
                &lt;AttentionSVG class="icon-attention" /&gt;
              </td>
              <td class="cursor">なし</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- /SVG -->
    <!-- editor -->
    <div
      v-if="selectItem === 'editor' || selectItem === ''"
      class="editor-parts"
    >
      <div>
        <h2>エディタ</h2>
        <h3>WysiwygEditor</h3>
        <table>
          <thead>
            <tr>
              <th class="sample">サンプル</th>
              <th class="structure">構造</th>
              <th class="other">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="sample">
                <WysiwygEditor
                  :prop-html="wysiwygEditorValue"
                  @updateHtml="updateHtml($event)"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="wysiwygEditorValue"></div>
              </td>
              <td class="structure">
                &lt;WysiwygEditor :prop-html="wysiwygEditorValue"
                @updateHtml="updateHtml($event)" /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す<br />
                  ・:prop-html★<br />
                  ・@updateHtml★
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>code mirror</h3>
        <table>
          <thead>
            <tr>
              <th class="sample">サンプル</th>
              <th class="structure">構造</th>
              <th class="other">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="sample">
                <CodeMirrorEditor
                  :prop-code="codeMirrorValue"
                  @updateCode="updateCode($event)"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="codeMirrorValue"></div>
              </td>
              <td class="structure">
                &lt;CodeMirrorEditor :prop-code="codeMirrorValue"
                @updateCode="updateCode($event)" /&gt;
              </td>
              <td class="other">
                <p>
                  下記を引数にコンポーネントを呼び出す<br />
                  ・:prop-code★<br />
                  ・@updateCode★
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- table -->
    <div
      v-if="
        (selectItem === 'validation' || selectItem === '') &&
        Object.keys(masterData).length > 0
      "
      class="validation"
    >
      <table>
        <thead>
          <tr>
            <th class="sample">サンプル</th>
            <th class="id">メッセージID</th>
            <th class="message">メッセージ文言</th>
            <th class="error">バリデーションエラー</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.format1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'format1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Format01</td>
            <td class="message">
              利用できない文字が含まれています。半角英語、半角数字または半角記号で入力してください。
            </td>
            <td class="error">全角文字を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.format2"
                :validation="
                  $common.getFormItemsDetail(formItems, 'format2').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Format02</td>
            <td class="message">
              利用できない文字が含まれています。半角英語または半角数字で入力してください。
            </td>
            <td class="error">全角文字または半角記号を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.format3"
                :validation="
                  $common.getFormItemsDetail(formItems, 'format3').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Format03</td>
            <td class="message">
              利用できない文字が含まれています。半角数字で入力してください。
            </td>
            <td class="error">全角文字または半角英語または半角記号を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.format4"
                :validation="
                  $common.getFormItemsDetail(formItems, 'format4').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Format04</td>
            <td class="message">
              利用できない文字が含まれています。全角カナで入力してください。
            </td>
            <td class="error">全角カナ以外の文字種を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.mail1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'mail1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Mail01</td>
            <td class="message">
              利用できない文字が含まれています。半角英語、半角数字または半角記号の「-_.@」が利用可能です。
            </td>
            <td class="error">全角文字、許容半角記号「-_.@」以外を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.mail2"
                :validation="
                  $common.getFormItemsDetail(formItems, 'mail2').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Mail02</td>
            <td class="message">
              メールアドレスの形式で入力してください（@がない、@が2つ以上ある、または@より後に.がありません）
            </td>
            <td class="error">@不足、@連続、@より後ろの文字列に.が不足</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputTextarea
                v-model="validation.mail3"
                :validation="
                  $common.getFormItemsDetail(formItems, 'mail3').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Mail03</td>
            <td class="message">複数登録できるメールアドレスは5件までです。</td>
            <td class="error">6件以上の改行が発生</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.url1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'url1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Url01</td>
            <td class="message">
              利用できない記号が含まれています。半角英語、半角数字または半角記号の「-_」が利用可能です。
            </td>
            <td class="error">全角文字、許容半角記号「-_」以外を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.url2"
                :validation="
                  $common.getFormItemsDetail(formItems, 'url2').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Url02</td>
            <td class="message">
              利用できない記号が含まれています。半角英語、半角数字または半角記号の「-_.;/?:@&amp;=+$,%#」が利用可能です。
            </td>
            <td class="error">
              全角文字、許容半角記号「-_.;/?:@&amp;=+$,%#」以外を入力
            </td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.url3"
                :validation="
                  $common.getFormItemsDetail(formItems, 'url3').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Url03</td>
            <td class="message">
              URLの形式で入力してください（http://またはhttps://から始めてください）
            </td>
            <td class="error">先頭文字列がhttps://またはhttps://以外</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.password1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'password1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Password01</td>
            <td class="message">
              英語の大文字小文字、数字を1つ以上組み合わせたパスワードを入力してください。
            </td>
            <td class="error">半角英語の大文字小文字、数字のいずれかが不足</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.ip1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'ip1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_Ip01</td>
            <td class="message">
              利用できない文字が含まれています。半角数字または半角記号の「.*」が利用可能です。
            </td>
            <td class="error">半角数字、許容半角記号「.*」以外を入力</td>
          </tr>
          <tr>
            <td class="sample">
              <CustomInputText
                v-model="validation.cfm1"
                :validation="
                  $common.getFormItemsDetail(formItems, 'cfm1').validation
                "
              />
            </td>
            <td class="id">ErrorMsg_CFM01</td>
            <td class="message">
              利用できない文字が含まれています。半角数字または半角記号の「-.」が利用可能です。
            </td>
            <td class="error">半角数字、許容半角記号「-.」以外を入力</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- /editor -->
    <!-- toolTipAndAreaLabel -->
    <div
      v-if="
        (selectItem === 'toolTipAndAreaLabel' || selectItem === '') &&
        Object.keys(masterData).length > 0
      "
      class="toolTipAndAreaLabel"
    >
      <table>
        <thead>
          <tr>
            <th class="sample">項目</th>
            <th class="sample">サンプル</th>
            <th class="id">構造</th>
            <th class="id">備考</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="sample">ツールチップ</td>
            <td class="sample">
              <TooltipHelp
                label="選択したページ種別に応じて、ページ作成時に配置されるパーツが変更されます。はじめからページを作成する場合は「その他」を選択してください。"
                class="tooltip"
              />
            </td>
            <td class="id">
              &lt;TooltipHelp
              label="選択したページ種別に応じて、ページ作成時に配置されるパーツが変更されます。はじめからページを作成する場合は「その他」を選択してください。"
              class="tooltip" /&gt;
            </td>
            <td>
              propは以下<br />
              label: { type: String, required: true, default: '' },
              //表示するテキストの内容 <br />
              width: { type: String, required: false, default: '250' },
              //エリアラベルの横幅<br />
              direction: { type: String, required: false, default: 'right' },
              //エリアラベルを表示する方向 right, left, top, bottom
              にて選択可能<br />
              left: { type: String, required: false, default: '' },
              //エリアラベルの表示位置<br />
              top: { type: String, required: false, default: '' },
              //エリアラベルの表示位置
            </td>
          </tr>
          <tr>
            <td class="sample">エリアラベル</td>
            <td class="sample">
              <CancelSVG
                class="btn-close"
                @click="closeModal($event, 'close')"
                @mouseover="$common.setAreaLabel($event, 'top', '閉じる')"
                @mouseleave="$common.setAreaLabel($event, '', '')"
                @blur="$common.setAreaLabel($event, '', '')"
              />
            </td>
            <td class="id">
              &lt;CancelSVG class="btn-close" @click="closeModal($event,
              'close')" @mouseover="$common.setAreaLabel($event, 'top',
              '閉じる')" @mouseleave="$common.setAreaLabel($event, '', '')"
              @blur="$common.setAreaLabel($event, '', '')" /&gt;
            </td>
            <td>
              layoutに&lt;AreaLabel /&gt;を入れる必要がある。<br />
              @mouseover="$common.setAreaLabel($event, derection, label)"
              <br />derection:エリアラベルを表示する方向 right, left, top,
              bottom<br />
              label:エリアラベルに表示するラベル<br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- / toolTipAndAreaLabel -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import CustomInputText from '~/components/common/form/CustomInputText.vue'
import CustomInputSelect from '~/components/common/form/CustomInputSelect.vue'
import CustomInputTextarea from '~/components/common/form/CustomInputTextarea.vue'
import CustomInputRadio from '~/components/common/form/CustomInputRadio.vue'
import CustomInputCheckbox from '~/components/common/form/CustomInputCheckbox.vue'
import CustomDatePicker from '~/components/common/form/CustomDatePicker.vue'
import CustomSelectHours from '~/components/common/form/CustomSelectHours.vue'
import CustomSelectMinutes from '~/components/common/form/CustomSelectMinutes.vue'
import CustomInputNumber from '~/components/common/form/CustomInputNumber.vue'
import CustomInputTel from '~/components/common/form/CustomInputTel.vue'
import AddBlockItem from '~/components/common/form/AddBlockItem.vue'
import FileUpload from '~/components/common/form/FileUpload.vue'

export default {
  layout: 'testPage',
  components: {
    CustomInputText,
    CustomInputSelect,
    CustomInputTextarea,
    CustomInputRadio,
    CustomInputCheckbox,
    CustomDatePicker,
    CustomSelectHours,
    CustomSelectMinutes,
    AddBlockItem,
    FileUpload,
    CustomInputNumber,
    CustomInputTel,
  },
  data() {
    const startDate = dayjs().subtract(6, 'days').format('YYYY/MM/DD')
    const endDate = dayjs().format('YYYY/MM/DD')
    return {
      styleView: false,
      selectItem: '',
      selectVal: '',
      inputText: 'あああ',
      inputSearchText: '検索条件などを入力',
      inputTextArea: '',
      inputRadio: '1',
      inputCheckbox: ['1'],
      selectDays: '',
      selectHours: '',
      selectMinutes: '',
      hoursVal: '12',
      minutesVal: '34',
      inputNumber: '1',
      inputTel: '1',
      password: '',
      tableOption: {
        selectSearchResultType: 'all',
        searchResultAll: 1000,
        searchResultFilter: 150,
        searchWordList: ['検索条件A', '検索条件B'],
        showTableType: 'table',
        settingShowNum: 20,
        currentPage: 1,
        maxDataNum: 365,
      },
      radioOptions: [
        {
          value: '1',
          label: 'ラジオA',
        },
        {
          value: '2',
          label: 'ラジオB',
        },
      ],
      checkboxOptions: [
        {
          value: '1',
          label: 'チェックボックスA',
        },
        {
          value: '2',
          label: 'チェックボックスB',
        },
        {
          value: '3',
          label: 'チェックボックスC',
        },
        {
          value: '4',
          label: 'チェックボックスD',
        },
      ],
      inputTextAreaPlaceholder:
        '例：ご家族ひとりひとりの夢を形に。<br />◯◯工務店は◯◯県◯◯市で創業以来◯年間、<br />地域に密着した家づくりを続けています。',
      validationInput: [
        {
          type: 'regex',
          regex: '^[0-9a-zA-Z]*$',
          message: '半角数値のみ入力可能です',
        },
        {
          type: 'minlength',
          minlength: 3,
          message: '最小3文字です。',
        },
        {
          type: 'maxlength',
          maxlength: 8,
          message: '最大8文字です。',
        },
        {
          type: 'ngvalue',
          ngvalue: ['tribeck', 'apple'],
          message: 'NGワードです',
        },
      ],
      validationSelect: [
        {
          type: 'ngvalue',
          ngvalue: ['2', '3'],
          message: '選択エラー',
        },
      ],
      validationInputTextarea: [
        {
          type: 'regex',
          regex: '^[0-9a-zA-Z]*$',
          message: '半角数値のみ入力可能です',
        },
        {
          type: 'maxlength',
          maxlength: 50,
          message: '最大50文字です。',
        },
      ],
      validationInputRadio: [
        {
          type: 'ngvalue',
          ngvalue: ['2'],
          message: '選択エラー',
        },
      ],
      validationInputCheckbox: [
        {
          type: 'ngvalue',
          ngvalue: ['2', '3'],
          message: '選択エラー',
        },
      ],
      buttons: [
        {
          label: 'ボタン1',
          link: '#button1',
        },
      ],
      buttons2: [
        {
          label: 'ボタン1',
          link: '#button1',
        },
      ],
      options: [
        {
          code: '1',
          label: 'りんご',
        },
        {
          code: '2',
          label: 'ごりら',
        },
        {
          code: '3',
          label: 'らっぱ',
        },
      ],
      pseudoSelectBoxValues: '',
      pseudoSelectBoxOptions: [
        {
          icon: 'HomeSVG',
          code: 'home',
          label: 'Home',
        },
        {
          icon: 'AppsSVG',
          code: 'apps',
          label: 'Apps',
        },
        {
          icon: 'NotificationsSVG',
          code: 'notifications',
          label: 'Notification',
        },
      ],
      wysiwygEditorValue: '',
      codeMirrorValue: '',
      dateRangePicker: {
        startDate,
        endDate,
      },
      parts: {
        フォント: {
          見出し: [
            {
              item: '見出し1',
              class: '-',
              structure: '<h1>見出し1</h1>',
              styles: ['font-size: 34px;'],
            },
            {
              item: '見出し2',
              class: '-',
              structure: '<h2>見出し2</h2>',
              styles: ['font-size: 28px;'],
            },
            {
              item: '見出し1',
              class: '-',
              structure: '<h3>見出し3</h3>',
              styles: ['font-size: 22px;'],
            },
            {
              item: '見出し4',
              class: '-',
              structure: '<h4>見出し4</h4>',
              styles: ['font-size: 20px;'],
            },
            {
              item: '見出し5',
              class: '-',
              structure: '<h5>見出し5</h5>',
              styles: ['font-size: 17px;'],
            },
          ],
          段落: [
            {
              item: 'フォントサイズノーマル',
              class: '-',
              structure:
                '<p>テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。</p>',
              styles: ['font-size: 15px;'],
            },
            {
              item: 'サブテキスト',
              class: 'font-size-middle',
              structure:
                '<p class="font-size-middle">テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。</p>',
              styles: ['font-size: 13px;'],
            },
            {
              item: 'キャプション',
              class: 'font-size-small',
              structure:
                '<p class="font-size-small">テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。</p>',
              styles: ['font-size: 12px;'],
            },
            {
              item: 'リンクテキスト',
              class: 'link-text',
              structure: '<a class="link-text">テキストが入ります。</a>',
              styles: ['color: #007AFF;', 'text-decoration: underline;'],
            },
          ],
        },
        ボタン: {
          Primaryボタン: [
            {
              item: '大ボタン',
              class: 'btn-primary btn-long',
              structure:
                '<button class="btn btn-primary btn-long">今すぐ公開</button>',
              styles: ['width: 200px;', 'height: 48px;', 'padding: 0 24px;'],
            },
            {
              item: '中ボタン(左右padding:16px)',
              class: 'btn-primary btn-middle',
              structure:
                '<button class="btn btn-primary btn-middle">今すぐ公開</button>',
              styles: [
                'min-width: 120px;',
                'height: 40px;',
                'padding: 0 16px;',
                'font-size: 13px;',
              ],
            },
            {
              item: '中ボタン(左右padding:12px)',
              class: 'btn-primary btn-middle',
              structure:
                '<button class="btn btn-primary btn-middle-short">今すぐ公開</button>',
              styles: [
                'min-width: 120px;',
                'height: 40px;',
                'padding: 0 12px;',
                'font-size: 13px;',
              ],
            },
            {
              item: '小ボタン',
              class: 'btn-primary btn-short',
              structure:
                '<button class="btn btn-primary btn-short">公開</button>',
              styles: ['height: 36px;', 'padding: 0 12px;'],
            },
            {
              item: '非活性',
              class: 'btn-primary btn-middle btn-disabled',
              structure:
                '<button class="btn btn-primary btn-middle btn-disabled">今すぐ公開</button>',
              styles: [
                'opacity: 0.32;',
                'cursor: default;',
                'font-size: 13px;',
              ],
            },
          ],
          Basicボタン: [
            {
              item: '大ボタン',
              class: 'btn-basic btn-long',
              structure:
                '<button class="btn btn-basic btn-long">保存して閉じる</button>',
              styles: ['width: 200px;', 'height: 48px;', 'padding: 0 24px;'],
            },
            {
              item: '中ボタン(左右padding:16px)',
              class: 'btn-basic btn-middle',
              structure:
                '<button class="btn btn-basic btn-middle">保存して閉じる</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 16px;',
              ],
            },
            {
              item: '中ボタン(左右padding:12px)',
              class: 'btn-primary btn-middle',
              structure:
                '<button class="btn btn-basic btn-middle-short">今すぐ公開</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 12px;',
              ],
            },
            {
              item: '小ボタン',
              class: 'btn-basic btn-short',
              structure:
                '<button class="btn btn-basic btn-short">公開</button>',
              styles: ['font-size: 13px;', 'height: 36px;', 'padding: 0 12px;'],
            },
            {
              item: '非活性',
              class: 'btn btn-basic btn-disabled',
              structure:
                '<button class="btn btn-basic btn-middle btn-disabled">保存して閉じる</button>',
              styles: ['opacity: 0.32;', 'cursor: default;'],
            },
          ],
          Secondaryボタン: [
            {
              item: '大ボタン',
              class: 'btn-secondary btn-long',
              structure:
                '<button class="btn btn-secondary btn-long">プレビュー</button>',
              styles: ['width: 200px;', 'height: 48px;', 'padding: 0 24px;'],
            },
            {
              item: '中ボタン(左右padding:16px)',
              class: 'btn-secondary btn-middle',
              structure:
                '<button class="btn btn-secondary btn-middle">プレビュー</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 16px;',
              ],
            },
            {
              item: '中ボタン(左右padding:12px)',
              class: 'btn-primary btn-middle',
              structure:
                '<button class="btn btn-secondary btn-middle-short">今すぐ公開</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 12px;',
              ],
            },
            {
              item: '小ボタン',
              class: 'btn-secondary btn-short',
              structure:
                '<button class="btn btn-secondary btn-short">公開</button>',
              styles: ['font-size: 13px;', 'height: 36px;', 'padding: 0 12px;'],
            },
            {
              item: '非活性',
              class: 'btn btn-secondary btn-disabled',
              structure:
                '<button class="btn btn-secondary btn-middle btn-disabled">プレビュー</button>',
              styles: ['opacity: 0.32;', 'cursor: default;'],
            },
          ],
          Cancelボタン: [
            {
              item: '大ボタン',
              class: 'btn-cancel btn-long',
              structure:
                '<button class="btn btn-cancel btn-long">キャンセル</button>',
              styles: ['width: 200px;', 'height: 48px;', 'padding: 0 24px;'],
            },
            {
              item: '中ボタン(左右padding:16px)',
              class: 'btn-cancel btn-middle',
              structure:
                '<button class="btn btn-cancel btn-middle">キャンセル</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 16px;',
              ],
            },
            {
              item: '中ボタン(左右padding:12px)',
              class: 'btn-primary btn-middle',
              structure:
                '<button class="btn btn-cancel btn-middle-short">今すぐ公開</button>',
              styles: [
                'min-width: 120px;',
                'font-size: 13px;',
                'height: 40px;',
                'padding: 0 12px;',
              ],
            },
            {
              item: '小ボタン',
              class: 'btn-cancel btn-short',
              structure:
                '<button class="btn btn-cancel btn-short">公開</button>',
              styles: ['font-size: 13px;', 'height: 36px;', 'padding: 0 12px;'],
            },
            {
              item: '非活性',
              class: 'btn btn-cancel btn-disabled',
              structure:
                '<button class="btn btn-cancel btn-middle btn-disabled">キャンセル</button>',
              styles: ['opacity: 0.32;', 'cursor: default;'],
            },
          ],
        },
      },
      validation: {
        format1: '',
        format2: '',
        format3: '',
        format4: '',
        mail1: '',
        mail2: '',
        mail3: '',
        url1: '',
        url2: '',
        url3: '',
        password: '',
        password1: '',
        ip1: '',
        cfm1: '',
      },
      formItems: [
        {
          id: 'format1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumberSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Format01'),
            },
          ],
        },
        {
          id: 'format2',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfStrNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format02'),
            },
          ],
        },
        {
          id: 'format3',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.halfNumber,
              message: this.$common.getMasterMessage('ErrorMsg_Format03'),
            },
          ],
        },
        {
          id: 'format4',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.zenKana,
              message: this.$common.getMasterMessage('ErrorMsg_Format04'),
            },
          ],
        },
        {
          id: 'mail1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mail,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
        {
          id: 'mail2',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.mailAt,
              message: this.$common.getMasterMessage('ErrorMsg_Mail02'),
            },
          ],
        },
        {
          id: 'mail3',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.fiveLineBreaks,
              message: this.$common.getMasterMessage('ErrorMsg_Mail03'),
            },
          ],
        },
        {
          id: 'url1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.idClass,
              message: this.$common.getMasterMessage('ErrorMsg_Url01'),
            },
          ],
        },
        {
          id: 'url2',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.domain,
              message: this.$common.getMasterMessage('ErrorMsg_Url02'),
            },
          ],
        },
        {
          id: 'url3',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.protocol,
              message: this.$common.getMasterMessage('ErrorMsg_Url03'),
            },
          ],
        },
        {
          id: 'password',
          validation: [
            {
              type: 'required',
              message: this.$common.getMasterMessage('ErrorMsg_Required01'),
            },
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.passwordNoSymbol,
              message: this.$common.getMasterMessage('ErrorMsg_Password01'),
            },
            {
              type: 'maxlength',
              maxlength: 98,
              message: this.$common.getMasterMessage('ErrorMsg_Count01', {
                maxlength: 98,
              }),
            },
          ],
        },
        {
          id: 'password1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.password,
              message: this.$common.getMasterMessage('ErrorMsg_Password01'),
            },
          ],
        },
        {
          id: 'ip1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.ipAddress,
              message: this.$common.getMasterMessage('ErrorMsg_Ip01'),
            },
          ],
        },
        {
          id: 'cfm1',
          validation: [
            {
              type: 'regex',
              regex: this.$globalVariable.regularExp.cfmSimulation,
              message: this.$common.getMasterMessage('ErrorMsg_CFM01'),
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState('common', ['masterData']),
    filterParts() {
      const result = {}

      for (const key in this.parts) {
        if (key === this.selectItem || this.selectItem === '') {
          result[key] = this.parts[key]
        }
      }

      return result
    },
  },
  created() {},
  methods: {
    additem() {
      const addBtn = {}
      const buttons = this.buttons

      addBtn.label = `ボタン${buttons.length + 1}`
      addBtn.link = `#button${buttons.length + 1}`

      this.buttons.push(addBtn)
    },
    additem2() {
      const addBtn = {}
      const buttons = this.buttons2

      addBtn.label = `ボタン${buttons.length + 1}`
      addBtn.link = `#button${buttons.length + 1}`

      this.buttons2.push(addBtn)
    },
    upload(file) {},
    changeSelectSearchResult(selectSearchResultType) {
      this.tableOption.selectSearchResultType = selectSearchResultType
    },
    deleteSearchWord(index) {
      this.tableOption.searchWordList.splice(index, 1)
    },
    /**
     * 表示タイプを変更
     */
    changeShowTableType(tableType) {
      this.tableOption.showTableType = tableType
    },
    /**
     * 次のページを表示
     */
    showNextPage() {
      this.tableOption.currentPage += 1
    },
    /**
     * 前のページを表示
     */
    showPrevPage() {
      this.tableOption.currentPage -= 1
    },
    /**
     * 表示件数の更新
     *
     * 選択した表示件数で再度APIを投げる
     */
    updateSettingShowNum(settingShowNum) {
      this.tableOption.settingShowNum = settingShowNum
      this.tableOption.currentPage = 1
    },
    /**
     * wysiwyg editorの入力値を更新する
     */
    updateHtml(newHtml) {
      this.wysiwygEditorValue = newHtml
    },
    /**
     * codemirrorの入力値を更新する
     */
    updateCode(newCode) {
      this.codeMirrorValue = newCode
    },
    /**
     * 範囲選択可能なdatepicker
     */
    updateDateRangePicker($event) {
      this.dateRangePicker = $event
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 30px;
  > div {
    margin-bottom: 30px;
  }
  h3 {
    margin: 10px 0;
  }
  .select_items {
    ul {
      display: flex;
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 130px;
        padding: 10px;
        margin: 5px;
        border: 1px solid;
        font-size: 24px;
        cursor: pointer;
        &.active {
          color: red;
          width: 180px;
          font-size: 32px;
        }
      }
    }
  }
}
table,
th,
td {
  border: 1px solid;
}
table {
  margin-top: 10px;
}
th {
  background: #97ceff;
}
th,
td {
  &.item {
    width: 180px;
  }
  &.sample {
    width: 250px;
  }
  &.class {
    width: 200px;
  }
  &.structure {
    width: 600px;
  }
  &.style {
    width: 300px;
  }
  &.other {
    width: 300px;
  }
}
.table-parts {
  .sample {
    width: 500px;
  }
}
.form-parts {
  .sample {
    width: 500px;
    .buttons {
      button {
        margin: 5px 0;
      }
    }
  }
}
td {
  padding: 10px;
}

.custom_date_picker {
  display: flex;
  .select_days {
    width: 240px;
  }
  .select_hours {
    width: 120px;
    margin-left: 16px;
  }
  .select_minutes {
    width: 120px;
    margin-left: 16px;
  }
}

.editor-parts {
  .sample {
    width: 600px;
  }
  .structure {
    width: 250px;
  }
}
.gray {
  background: #999;
}
.cursor.is-pointer {
  background: red;
}
</style>
