<template>
  <div class="form-preview">
    <div class="contents" :class="{ sp: selectDispType === 2 }">
      <div id="xhm-form">
        <!-- ステップ -->
        <div class="xhm-step">
          <nav>
            <ul>
              <li class="current">入力</li>
              <li>確認</li>
              <li>完了</li>
            </ul>
          </nav>
        </div>

        <!-- テキストフィールド -->
        <div class="xhm-text-field xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              テキストフィールド
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="">注釈が入ります</p>
            <div class="xhm-message-error">
              <div>この項目は必ず入力してください</div>
            </div>
            <input
              id="text"
              type="text"
              placeholder="凡例"
              maxlength="100"
              class="form-control"
              style="width: 100%"
            />
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
          </div>
        </div>

        <div class="xhm-text-field xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              テキストフィールド
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
            <input
              id="preview-input"
              type="text"
              placeholder="凡例"
              maxlength="100"
              class="form-control"
              style="width: 100%"
            />
            <p class="xhm-annotation" style="">注釈が入ります</p>
          </div>
        </div>

        <!-- テキストエリア -->
        <div class="xhm-text-area xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              テキストエリア
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p for="textarea" class="xhm-annotation" style="">注釈が入ります</p>
            <textarea
              id="textarea"
              maxlength="200"
              rows="5"
              class="form-control"
              style="width: 100%"
            ></textarea>
            <p for="textarea" class="xhm-annotation" style="display: none">
              注釈が入ります
            </p>
          </div>
        </div>

        <!-- ラジオボタン -->
        <div
          class="xhm-radio xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-radio-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              ラジオボタン
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid--1of6">
              <ul>
                <li>
                  <input id="radio-00" type="radio" name="radio" value="1" />
                  <label for="radio-00" class="xhm-radio-label"
                    ><span>選択肢1</span></label
                  >
                </li>
                <li>
                  <input id="radio-01" type="radio" name="radio" value="2" />
                  <label for="radio-01" class="xhm-radio-label"
                    ><span>選択肢2</span></label
                  >
                </li>
                <li>
                  <input id="radio-02" type="radio" name="radio" value="3" />
                  <label for="radio-02" class="xhm-radio-label"
                    ><span>選択肢3</span></label
                  >
                </li>
              </ul>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <div
          class="xhm-radio xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-radio-no-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              ラジオボタン
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="">注釈が入ります</p>
            <div
              fragment="15c6815f10e"
              class="xhm-grid xhm-grid--gutters xhm-grid--1of6"
            >
              <span
                ><input
                  id="radio-no-break-00"
                  type="radio"
                  name="radio-no-break"
                  value="1"
                />
                <label for="radio-no-break-00" class="xhm-radio-label"
                  ><span>選択肢1</span></label
                ></span
              ><span
                ><input
                  id="radio-no-break-01"
                  type="radio"
                  name="radio-no-break"
                  value="2"
                />
                <label for="radio-no-break-01" class="xhm-radio-label"
                  ><span>選択肢2</span></label
                ></span
              ><span
                ><input
                  id="radio-no-break-02"
                  type="radio"
                  name="radio-no-break"
                  value="3"
                />
                <label for="radio-no-break-02" class="xhm-radio-label"
                  ><span>選択肢3</span></label
                ></span
              >
            </div>
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
          </div>
        </div>

        <!-- チェックボックス -->
        <div
          class="xhm-checkbox xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-checkbox-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              チェックボックス
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid--1of6">
              <ul>
                <li>
                  <input
                    id="checkbox-00"
                    type="checkbox"
                    name="checkbox-preview"
                    value="1"
                  />
                  <label for="checkbox-00" class="xhm-checkbox-label"
                    ><span>選択肢1</span></label
                  >
                </li>
                <li>
                  <input
                    id="checkbox-01"
                    type="checkbox"
                    name="checkbox-preview"
                    value="2"
                  />
                  <label for="checkbox-01" class="xhm-checkbox-label"
                    ><span>選択肢2</span></label
                  >
                </li>
                <li>
                  <input
                    id="checkbox-02"
                    type="checkbox"
                    name="checkbox-preview"
                    value="3"
                  />
                  <label for="checkbox-02" class="xhm-checkbox-label"
                    ><span>選択肢3</span></label
                  >
                </li>
              </ul>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <div
          class="xhm-checkbox xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-checkbox-no-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              チェックボックス
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
            <div
              fragment="13d983589c5"
              class="xhm-grid xhm-grid--gutters xhm-grid--1of6"
            >
              <span
                ><input
                  id="checkbox-no-break-00"
                  type="checkbox"
                  name="checkbox-preview"
                  value="1"
                />
                <label for="checkbox-no-break-00" class="xhm-checkbox-label"
                  ><span>選択肢1</span></label
                ></span
              ><span
                ><input
                  id="checkbox-no-break-01"
                  type="checkbox"
                  name="checkbox-preview"
                  value="2"
                />
                <label for="checkbox-no-break-01" class="xhm-checkbox-label"
                  ><span>選択肢2</span></label
                ></span
              ><span
                ><input
                  id="checkbox-no-break-02"
                  type="checkbox"
                  name="checkbox-preview"
                  value="3"
                />
                <label for="checkbox-no-break-02" class="xhm-checkbox-label"
                  ><span>選択肢3</span></label
                ></span
              >
            </div>
            <p class="xhm-annotation" style="">注釈が入ります</p>
          </div>
        </div>

        <!-- セレクトボックス -->
        <div
          class="xhm-select xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              セレクトボックス
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div
              class="xhm-grid xhm-grid--gutters xhm-grid--1of2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-select-box">
                  <select>
                    <option>選択してください</option>
                    <option value="1">選択肢1</option>
                    <option value="2">選択肢2</option>
                    <option value="3">選択肢3</option>
                  </select>
                </div>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <!-- 見出し（h1） -->
        <div class="xhm-heading-main"><h1>見出し(h1)</h1></div>

        <!-- 見出し（h2） -->
        <div class="xhm-heading-sub"><h2>見出し(h2)</h2></div>

        <!-- テキスト -->
        <div class="xhm-text xhm-grid xhm-grid--full">
          <div class="xhm-grid-cell"><p>テキストテキスト</p></div>
        </div>

        <!-- 区切り線 -->
        <div class="xhm-separator"><hr /></div>

        <!-- ファイル添付 -->
        <div
          class="xhm-attaching-file xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              ファイル添付
            </p>
          </div>
          <div class="xhm-grid-cell">
            <label for="fileUpload" class="file-upload mb-0"
              >ファイルを選択 <input id="fileUpload" type="file"
            /></label>
            <p class="size">（最大ファイルサイズ：10MBまで）</p>
          </div>
        </div>

        <!-- お知らせ許諾 -->
        <div
          class="xhm-permission xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-permission-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              お知らせ許諾
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation">注釈が入ります</p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid--1of6">
              <ul>
                <li>
                  <input
                    id="permission-00"
                    type="radio"
                    name="permission-preview"
                    value="1"
                  />
                  <label for="permission-00" class="xhm-permission-label"
                    ><span>希望する</span></label
                  >
                </li>
                <li>
                  <input
                    id="permission-01"
                    type="radio"
                    name="permission-preview"
                    value="0"
                  />
                  <label for="permission-01" class="xhm-permission-label"
                    ><span>希望しない</span></label
                  >
                </li>
              </ul>
            </div>
            <p style="display: none">注釈が入ります</p>
          </div>
        </div>

        <div
          class="xhm-permission xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-permission-no-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              お知らせ許諾
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
            <div
              fragment="15ce1b17a68"
              class="xhm-grid xhm-grid--gutters xhm-grid--1of6"
            >
              <span
                ><input
                  id="permission-no-break-00"
                  type="radio"
                  name="permission-preview"
                  value="1"
                />
                <label for="permission-no-break-00" class="xhm-permission-label"
                  ><span>希望する</span></label
                ></span
              ><span
                ><input
                  id="permission-no-break-01"
                  type="radio"
                  name="permission-preview"
                  value="0"
                />
                <label for="permission-no-break-01" class="xhm-permission-label"
                  ><span>希望しない</span></label
                ></span
              >
            </div>
            <p style="display: none">注釈が入ります</p>
          </div>
        </div>

        <!-- 規約表示 -->
        <div
          class="xhm-terms xhm-terms-no-break xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              個人情報保護方針
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation">
              ※必ずお読みいただき同意の上お申し込みください※
            </p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid--1of6">
              <input id="term" type="checkbox" />
              <label for="term" class="xhm-terms-label"
                ><span>個人情報保護方針に同意する</span></label
              >
            </div>
            <p style="display: none">
              ※必ずお読みいただき同意の上お申し込みください※
            </p>
          </div>
        </div>

        <!-- スペーサー -->
        <div class="xhm-spacer-20"></div>

        <!-- 改ページ -->
        <div class="xhm-grid xhm-grid--gutters xhm-grid-clear">
          <div class="xhm-grid-cell">
            <div class="xhm-btn-back"><button type="button">戻る</button></div>
          </div>
          <div class="xhm-grid-cell">
            <div class="xhm-btn-next">
              <button type="button">次の質問へ</button>
            </div>
          </div>
        </div>

        <!-- パラメータ -->
        <div class="xhm-text-field xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell"><p class="xhm-title">パラメータ</p></div>
          <div class="xhm-grid-cell">
            <input type="text" readonly="readonly" class="form-control" />
          </div>
        </div>

        <!-- 都道府県 -->
        <div
          class="xhm-prefectures xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              都道府県
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="">注釈が入ります</p>
            <div
              class="xhm-grid xhm-grid--gutters xhm-grid--1of2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-prefectures-box">
                  <select>
                    <option>選択してください</option>
                    <!---->
                    <optgroup label="北海道">
                      <option value="北海道">北海道</option>
                    </optgroup>
                    <!---->
                    <optgroup label="東北">
                      <option value="青森県">青森県</option>
                      <option value="岩手県">岩手県</option>
                      <option value="宮城県">宮城県</option>
                      <option value="秋田県">秋田県</option>
                      <option value="山形県">山形県</option>
                      <option value="福島県">福島県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="関東">
                      <option value="茨城県">茨城県</option>
                      <option value="栃木県">栃木県</option>
                      <option value="群馬県">群馬県</option>
                      <option value="埼玉県">埼玉県</option>
                      <option value="千葉県">千葉県</option>
                      <option value="東京都">東京都</option>
                      <option value="神奈川県">神奈川県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="中部">
                      <option value="新潟県">新潟県</option>
                      <option value="富山県">富山県</option>
                      <option value="石川県">石川県</option>
                      <option value="福井県">福井県</option>
                      <option value="山梨県">山梨県</option>
                      <option value="長野県">長野県</option>
                      <option value="岐阜県">岐阜県</option>
                      <option value="静岡県">静岡県</option>
                      <option value="愛知県">愛知県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="近畿">
                      <option value="三重県">三重県</option>
                      <option value="滋賀県">滋賀県</option>
                      <option value="京都府">京都府</option>
                      <option value="大阪府">大阪府</option>
                      <option value="兵庫県">兵庫県</option>
                      <option value="奈良県">奈良県</option>
                      <option value="和歌山県">和歌山県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="中国">
                      <option value="鳥取県">鳥取県</option>
                      <option value="島根県">島根県</option>
                      <option value="岡山県">岡山県</option>
                      <option value="広島県">広島県</option>
                      <option value="山口県">山口県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="四国">
                      <option value="徳島県">徳島県</option>
                      <option value="香川県">香川県</option>
                      <option value="愛媛県">愛媛県</option>
                      <option value="高知県">高知県</option>
                    </optgroup>
                    <!---->
                    <optgroup label="九州・沖縄">
                      <option value="福岡県">福岡県</option>
                      <option value="佐賀県">佐賀県</option>
                      <option value="長崎県">長崎県</option>
                      <option value="熊本県">熊本県</option>
                      <option value="大分県">大分県</option>
                      <option value="宮崎県">宮崎県</option>
                      <option value="鹿児島県">鹿児島県</option>
                      <option value="沖縄県">沖縄県</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
          </div>
        </div>

        <!-- 性別 -->
        <div
          class="xhm-radio xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-radio-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              性別
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid--1of6">
              <ul>
                <li>
                  <input
                    id="radio-sex-00"
                    type="radio"
                    name="radio-preview"
                    value="1"
                  />
                  <label for="radio-sex-00" class="xhm-radio-label"
                    ><span>男性</span></label
                  >
                </li>
                <li>
                  <input
                    id="radio-sex-01"
                    type="radio"
                    name="radio-preview"
                    value="2"
                  />
                  <label for="radio-sex-01" class="xhm-radio-label"
                    ><span>女性</span></label
                  >
                </li>
                <!---->
              </ul>
            </div>
            <p class="xhm-annotation" style="">注釈が入ります</p>
          </div>
        </div>

        <div
          class="xhm-radio xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear xhm-radio-no-break"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              性別
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
            <div
              fragment="3f0537f4e5"
              class="xhm-grid xhm-grid--gutters xhm-grid--1of6"
            >
              <span
                ><input
                  id="radio-sex-radio-no-break00"
                  type="radio"
                  name="radio-preview"
                  value="1"
                />
                <label for="radio-sex-radio-no-break00" class="xhm-radio-label"
                  ><span>男性</span></label
                ></span
              ><span
                ><input
                  id="radio-sex-radio-no-break01"
                  type="radio"
                  name="radio-preview"
                  value="2"
                />
                <label for="radio-sex-radio-no-break01" class="xhm-radio-label"
                  ><span>女性</span></label
                ></span
              ><span
                ><input
                  id="radio-sex-radio-no-break02"
                  type="radio"
                  name="radio-preview"
                  value="0"
                />
                <label for="radio-sex-radio-no-break02" class="xhm-radio-label"
                  ><span>不明</span></label
                ></span
              >
            </div>
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
          </div>
        </div>

        <!-- お名前 -->
        <div class="xhm-name xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              お名前
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation">お名前を入力してください。</p>
            <div
              fragment="17074cf2dc6"
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">姓</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）閃木" />
                  </div>
                </div>
              </div>
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">名</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）太郎" />
                  </div>
                </div>
              </div>
            </div>
            <div
              fragment="17074cf2dc6"
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">姓かな</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）ひらめき" />
                  </div>
                </div>
              </div>
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">名かな</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）たろう" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="xhm-name xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              お名前
            </p>
          </div>
          <div class="xhm-grid-cell">
            <div
              fragment="17074cf2dc6"
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">姓名</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）閃木太郎" />
                  </div>
                </div>
              </div>
            </div>
            <div
              fragment="17074cf2dc6"
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <div class="xhm-grid xhm-grid--gutters xhm-grid--center">
                  <div class="xhm-grid-cell">姓名かな</div>
                  <div class="xhm-grid-cell xhm-grid-grow--4">
                    <input type="text" placeholder="例）ひらめきたろう" />
                  </div>
                </div>
              </div>
            </div>
            <div fragment="17074cf2dc6"></div>
          </div>
        </div>

        <!-- メールアドレス -->
        <div class="xhm-mail-address xhm-grid xhm-grid--gutters xhm-grid--1of4">
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              メールアドレス
            </p>
          </div>
          <div class="xhm-grid-cell">
            <div
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <p for="preview-mail-address" class="xhm-annotation" style="">
                  確認のためもう一度入力してください。※メールアドレスのドメイン部分には英大文字を使う事はできません。
                </p>
                <input
                  id="preview-mail-address"
                  type="text"
                  placeholder="メールアドレスを入力"
                />
              </div>
            </div>
            <div
              class="xhm-grid xhm-grid--gutters xhm-grid--cols-2 xhm-grid-clear"
            >
              <div class="xhm-grid-cell">
                <input
                  id="preview-confirm-mail-address"
                  type="text"
                  placeholder="メールアドレスを確認"
                />
                <p
                  for="preview-mail-address"
                  class="xhm-annotation"
                  style="display: none"
                >
                  確認のためもう一度入力してください。※メールアドレスのドメイン部分には英大文字を使う事はできません。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 生年月日 -->
        <div
          class="xhm-birthday xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              生年月日
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none">
              生年月日を設定してください。
            </p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid-clear">
              <div class="xhm-birthday-select xhm-grid-cell">
                <select>
                  <option>2003</option>
                  <option>2002</option>
                  <option>2001</option>
                  <option>2000</option>
                  <option>1999</option>
                  <option>1998</option>
                  <option>1997</option>
                  <option>1996</option>
                  <option>1995</option>
                  <option>1994</option>
                  <option>1993</option>
                  <option>1992</option>
                  <option>1991</option>
                  <option>1990</option>
                  <option>1989</option>
                  <option>1988</option>
                  <option>1987</option>
                  <option>1986</option>
                  <option>1985</option>
                  <option>1984</option>
                  <option>1983</option>
                  <option>1982</option>
                  <option>1981</option>
                  <option>1980</option>
                  <option>1979</option>
                  <option>1978</option>
                  <option>1977</option>
                  <option>1976</option>
                  <option>1975</option>
                  <option>1974</option>
                  <option>1973</option>
                  <option>1972</option>
                  <option>1971</option>
                  <option>1970</option>
                  <option>1969</option>
                  <option>1968</option>
                  <option>1967</option>
                  <option>1966</option>
                  <option>1965</option>
                  <option>1964</option>
                  <option>1963</option>
                  <option>1962</option>
                  <option>1961</option>
                  <option>1960</option>
                  <option>1959</option>
                  <option>1958</option>
                  <option>1957</option>
                  <option>1956</option>
                  <option>1955</option>
                  <option>1954</option>
                  <option>1953</option>
                  <option>1952</option>
                  <option>1951</option>
                  <option>1950</option>
                  <option>1949</option>
                  <option>1948</option>
                  <option>1947</option>
                  <option>1946</option>
                  <option>1945</option>
                  <option>1944</option>
                  <option>1943</option>
                  <option>1942</option>
                  <option>1941</option>
                </select>
                <label class="form-text ml-1 mr-1">年</label>
              </div>
              <div class="xhm-birthday-select xhm-grid-cell">
                <select>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
                <label class="form-text ml-1 mr-1">月</label>
              </div>
              <div class="xhm-birthday-select xhm-grid-cell">
                <select>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </select>
                <span class="form-text ml-1 mr-1">日</span>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none">
              生年月日を設定してください。
            </p>
          </div>
        </div>

        <!-- 年月 -->
        <div
          class="xhm-year-and-month xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              年月
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid-clear">
              <div class="xhm-year-and-month-select xhm-grid-cell">
                <select>
                  <option selected="selected" value="0">年を選択</option>
                  <option>2011</option>
                  <option>2012</option>
                  <option>2013</option>
                  <option>2014</option>
                  <option>2015</option>
                  <option>2016</option>
                  <option>2017</option>
                  <option>2018</option>
                  <option>2019</option>
                  <option>2020</option>
                  <option>2021</option>
                </select>
                <label>年</label>
              </div>
              <div class="xhm-year-and-month-select xhm-grid-cell">
                <select>
                  <option selected="selected" value="0">月を選択</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
                <label>月</label>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <div
          class="xhm-year-and-month xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              年月
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="">注釈が入ります</p>
            <div class="xhm-grid xhm-grid--gutters xhm-grid-clear">
              <div class="xhm-year-and-month-select xhm-grid-cell">
                <select>
                  <option selected="selected" value="0">年を選択</option>
                  <option>2011</option>
                  <option>2012</option>
                  <option>2013</option>
                  <option>2014</option>
                  <option>2015</option>
                  <option>2016</option>
                  <option>2017</option>
                  <option>2018</option>
                  <option>2019</option>
                  <option>2020</option>
                  <option>2021</option>
                </select>
                <label>年</label>
              </div>
              <!---->
            </div>
            <p class="xhm-annotation" style="display: none">注釈が入ります</p>
          </div>
        </div>

        <!-- 日付 -->
        <div
          class="xhm-calendar xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              日付
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-calendar-select">
              <div>
                <label for="datepicker"
                  ><input
                    id="datepicker"
                    type="text"
                    placeholder="日付を選択してください"
                    autocomplete="off"
                    class="hasDatepicker" />
                  <img
                    src="https://www.xdata.jp/form/icon/calendar-select-icon.png"
                    alt=""
                    class="xhm-datepicker"
                /></label>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <div
          class="xhm-calendar xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              日付
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-calendar-select">
              <div>
                <label for="datepicker1"
                  ><input
                    id="datepicker1"
                    type="text"
                    placeholder="日付を選択してください"
                    autocomplete="off"
                    class="hasDatepicker"
                  />
                  <img
                    src="https://www.xdata.jp/form/icon/calendar-select-icon.png"
                    alt=""
                    class="xhm-datepicker"
                  />
                </label>
              </div>
              <div class="xhm-select">
                <select>
                  <option disabled="disabled" selected="selected" value="0">
                    時間を選択
                  </option>
                  <option value="00">00時</option>
                  <option value="01">01時</option>
                  <option value="02">02時</option>
                  <option value="03">03時</option>
                  <option value="04">04時</option>
                  <option value="05">05時</option>
                  <option value="06">06時</option>
                  <option value="07">07時</option>
                  <option value="08">08時</option>
                  <option value="09">09時</option>
                  <option value="10">10時</option>
                  <option value="11">11時</option>
                  <option value="12">12時</option>
                  <option value="13">13時</option>
                  <option value="14">14時</option>
                  <option value="15">15時</option>
                  <option value="16">16時</option>
                  <option value="17">17時</option>
                  <option value="18">18時</option>
                  <option value="19">19時</option>
                  <option value="20">20時</option>
                  <option value="21">21時</option>
                  <option value="22">22時</option>
                  <option value="23">23時</option>
                </select>
              </div>
              <!---->
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <div
          class="xhm-calendar xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-optional">任意</span>
              日付
            </p>
          </div>
          <div class="xhm-grid-cell">
            <p class="xhm-annotation" style="display: none"></p>
            <div class="xhm-calendar-select">
              <div>
                <label for="datepicker2"
                  ><input
                    id="datepicker2"
                    placeholder="日付を選択してください"
                    type="text"
                    autocomplete="off"
                    class="hasDatepicker"
                  />
                  <img
                    src="https://www.xdata.jp/form/icon/calendar-select-icon.png"
                    alt=""
                    class="xhm-datepicker"
                  />
                </label>
              </div>
              <div class="xhm-select">
                <select>
                  <option disabled="disabled" selected="selected" value="0">
                    時間を選択
                  </option>
                  <option value="00">00時</option>
                  <option value="01">01時</option>
                  <option value="02">02時</option>
                  <option value="03">03時</option>
                  <option value="04">04時</option>
                  <option value="05">05時</option>
                  <option value="06">06時</option>
                  <option value="07">07時</option>
                  <option value="08">08時</option>
                  <option value="09">09時</option>
                  <option value="10">10時</option>
                  <option value="11">11時</option>
                  <option value="12">12時</option>
                  <option value="13">13時</option>
                  <option value="14">14時</option>
                  <option value="15">15時</option>
                  <option value="16">16時</option>
                  <option value="17">17時</option>
                  <option value="18">18時</option>
                  <option value="19">19時</option>
                  <option value="20">20時</option>
                  <option value="21">21時</option>
                  <option value="22">22時</option>
                  <option value="23">23時</option>
                </select>
              </div>
              <div class="xhm-select">
                <select>
                  <option disabled="disabled" selected="selected" value="0">
                    分を選択
                  </option>
                  <option value="0分">0分</option>
                  <option value="1分">1分</option>
                  <option value="2分">2分</option>
                  <option value="3分">3分</option>
                  <option value="4分">4分</option>
                  <option value="5分">5分</option>
                  <option value="6分">6分</option>
                  <option value="7分">7分</option>
                  <option value="8分">8分</option>
                  <option value="9分">9分</option>
                  <option value="10分">10分</option>
                  <option value="11分">11分</option>
                  <option value="12分">12分</option>
                  <option value="13分">13分</option>
                  <option value="14分">14分</option>
                  <option value="15分">15分</option>
                  <option value="16分">16分</option>
                  <option value="17分">17分</option>
                  <option value="18分">18分</option>
                  <option value="19分">19分</option>
                  <option value="20分">20分</option>
                  <option value="21分">21分</option>
                  <option value="22分">22分</option>
                  <option value="23分">23分</option>
                  <option value="24分">24分</option>
                  <option value="25分">25分</option>
                  <option value="26分">26分</option>
                  <option value="27分">27分</option>
                  <option value="28分">28分</option>
                  <option value="29分">29分</option>
                  <option value="30分">30分</option>
                  <option value="31分">31分</option>
                  <option value="32分">32分</option>
                  <option value="33分">33分</option>
                  <option value="34分">34分</option>
                  <option value="35分">35分</option>
                  <option value="36分">36分</option>
                  <option value="37分">37分</option>
                  <option value="38分">38分</option>
                  <option value="39分">39分</option>
                  <option value="40分">40分</option>
                  <option value="41分">41分</option>
                  <option value="42分">42分</option>
                  <option value="43分">43分</option>
                  <option value="44分">44分</option>
                  <option value="45分">45分</option>
                  <option value="46分">46分</option>
                  <option value="47分">47分</option>
                  <option value="48分">48分</option>
                  <option value="49分">49分</option>
                  <option value="50分">50分</option>
                  <option value="51分">51分</option>
                  <option value="52分">52分</option>
                  <option value="53分">53分</option>
                  <option value="54分">54分</option>
                  <option value="55分">55分</option>
                  <option value="56分">56分</option>
                  <option value="57分">57分</option>
                  <option value="58分">58分</option>
                  <option value="59分">59分</option>
                </select>
              </div>
            </div>
            <p class="xhm-annotation" style="display: none"></p>
          </div>
        </div>

        <!-- 住所 -->
        <div
          class="xhm-address xhm-grid xhm-grid--gutters xhm-grid--1of4 xhm-grid-clear"
        >
          <div class="xhm-grid-cell">
            <p class="xhm-title">
              <span class="xhm-required">必須</span>
              住所
            </p>
          </div>
          <div class="xhm-grid-cell">
            <div class="xhm-grid xhm-grid--gutters">
              <div class="xhm-grid-cell">
                <p class="xhm-annotation" style="">
                  住所を入力してください。建物名以外は必須項目です。
                </p>
                <div
                  class="xhm-grid xhm-grid--gutters xhm-grid--1of6 xhm-grid-clear"
                >
                  <div class="xhm-grid-cell"><label>郵便番号</label></div>
                  <div class="xhm-grid-cell">
                    <div class="xhm-grid xhm-grid--gutters">
                      <div class="xhm-grid-cell">
                        <input type="number" placeholder="例）1070052" />
                      </div>
                      <div class="xhm-grid-cell">
                        <button class="xhm-btn-post-search">自動入力</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="xhm-grid xhm-grid--gutters xhm-grid--1of6 xhm-grid-clear"
                >
                  <div class="xhm-grid-cell"><label>都道府県</label></div>
                  <div class="xhm-grid-cell">
                    <div class="xhm-address-select-box">
                      <select>
                        <option value="">選択してください</option>
                        <option value="北海道">北海道</option>
                        <option value="青森県">青森県</option>
                        <option value="岩手県">岩手県</option>
                        <option value="宮城県">宮城県</option>
                        <option value="秋田県">秋田県</option>
                        <option value="山形県">山形県</option>
                        <option value="福島県">福島県</option>
                        <option value="茨城県">茨城県</option>
                        <option value="栃木県">栃木県</option>
                        <option value="群馬県">群馬県</option>
                        <option value="埼玉県">埼玉県</option>
                        <option value="千葉県">千葉県</option>
                        <option value="東京都">東京都</option>
                        <option value="神奈川県">神奈川県</option>
                        <option value="新潟県">新潟県</option>
                        <option value="富山県">富山県</option>
                        <option value="石川県">石川県</option>
                        <option value="福井県">福井県</option>
                        <option value="山梨県">山梨県</option>
                        <option value="長野県">長野県</option>
                        <option value="岐阜県">岐阜県</option>
                        <option value="静岡県">静岡県</option>
                        <option value="愛知県">愛知県</option>
                        <option value="三重県">三重県</option>
                        <option value="滋賀県">滋賀県</option>
                        <option value="京都府">京都府</option>
                        <option value="大阪府">大阪府</option>
                        <option value="兵庫県">兵庫県</option>
                        <option value="奈良県">奈良県</option>
                        <option value="和歌山県">和歌山県</option>
                        <option value="鳥取県">鳥取県</option>
                        <option value="島根県">島根県</option>
                        <option value="岡山県">岡山県</option>
                        <option value="広島県">広島県</option>
                        <option value="山口県">山口県</option>
                        <option value="徳島県">徳島県</option>
                        <option value="香川県">香川県</option>
                        <option value="愛媛県">愛媛県</option>
                        <option value="高知県">高知県</option>
                        <option value="福岡県">福岡県</option>
                        <option value="佐賀県">佐賀県</option>
                        <option value="長崎県">長崎県</option>
                        <option value="熊本県">熊本県</option>
                        <option value="大分県">大分県</option>
                        <option value="宮崎県">宮崎県</option>
                        <option value="鹿児島県">鹿児島県</option>
                        <option value="沖縄県">沖縄県</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  class="xhm-grid xhm-grid--gutters xhm-grid--1of6 xhm-grid-clear"
                >
                  <div class="xhm-grid-cell"><label>市区町村</label></div>
                  <div class="xhm-grid-cell">
                    <input type="text" placeholder="市区町村を入力" />
                  </div>
                </div>
                <div
                  class="xhm-grid xhm-grid--gutters xhm-grid--1of6 xhm-grid-clear"
                >
                  <div class="xhm-grid-cell"><label>番地</label></div>
                  <div class="xhm-grid-cell">
                    <input type="text" placeholder="番地を入力" />
                  </div>
                </div>
                <div
                  class="xhm-grid xhm-grid--gutters xhm-grid--1of6 xhm-grid-clear"
                >
                  <div class="xhm-grid-cell"><label>建物名</label></div>
                  <div class="xhm-grid-cell">
                    <input type="text" placeholder="建物名を入力" />
                  </div>
                </div>
                <p class="xhm-annotation" style="display: none">
                  住所を入力してください。建物名以外は必須項目です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectDispType: 1,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="css" scoped>
@import '~assets/styles/css/formStyle.css';
</style>
