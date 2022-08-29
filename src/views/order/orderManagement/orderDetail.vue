<!--
 * @Descripttion: 订单详情
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-16 00:00:00
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-18 16:46:43
-->
<template>
  <div class="orderDetailView">
    <div class="orderDetailHeader">
      <div class="orderDetailHeaderTitle">
        <i class="el-icon-arrow-left" @click="backPrevFn"></i>包裹「{{
          packageId
        }}」详情 - 来源于「{{ orderData.source }}」
      </div>
      <div class="orderBuyerInfo clearfix">
        <div class="fl orderBuyerInfoList">
          <span class="orderBuyerInfoListTitle">卖家：</span>
          <span class="orderBuyerInfoListContent" :title="orderData.domain">{{
            orderData.domain
          }}</span>
        </div>
        <div class="fl orderBuyerInfoList">
          <span class="orderBuyerInfoListTitle">买家姓名：</span>
          <span
            class="orderBuyerInfoListContent"
            :title="orderData.orderName"
            >{{ orderData.orderName }}</span
          >
        </div>
        <div class="fl orderBuyerInfoList">
          <span class="orderBuyerInfoListTitle">买家邮箱：</span>
          <el-tooltip placement="top" :offset="10">
            <template #content>
              <a style="color: #fff" v-copy="orderData.email">复制</a>
            </template>
            <span class="orderBuyerInfoListContent" :title="orderData.email">{{
              orderData.email
            }}</span>
          </el-tooltip>
        </div>
        <div class="fl orderBuyerInfoList" v-if="orderData.packageRels">
          <span class="orderBuyerInfoListTitle">包裹总额：</span>
          <span
            class="orderBuyerInfoListContent"
            :title="
              orderData.packageRels[0]?.currency + ' ' + orderData.totalPrice
            "
            >{{ orderData.packageRels[0]?.currency }}
            {{ orderData.totalPrice }}</span
          >
        </div>
        <div class="fl orderBuyerInfoList">
          <span class="orderBuyerInfoListTitle">订单状态：</span>
          <span
            class="orderBuyerInfoListContent redColor"
            :title="orderStatusText"
            >{{ orderStatusText }}</span
          >
        </div>
        <div class="fr pageBtn">
          <el-button
            type="primary"
            :disabled="prevPackageId == ''"
            @click="goToPage(prevPackageId)"
            >上一个</el-button
          >
          <el-button
            type="primary"
            :disabled="nextPackageId == ''"
            @click="goToPage(nextPackageId)"
            >下一个</el-button
          >
        </div>
      </div>
    </div>
    <div class="orderDetailRightSider">
      <div class="orderDetailTitle">快速导航</div>
      <div class="orderDetailRightSiderContent">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :class="index == activeStatus ? 'active' : ''"
            :color="index == activeStatus ? '#1890FF' : '#CDCDCD'"
            :key="index"
            @click="clickFn(activity.id, index)"
          >
            {{ activity.title }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <ul class="orderDetailBody">
      <li class="orderDetailList customInfoList threeList" id="customInfo">
        <div class="orderDetailTitle">客户信息</div>
        <el-form
          :model="orderData"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm clearfix"
        >
          <el-form-item label="客户姓：" prop="lastName" class="fl">
            <el-input
              v-model="orderData.lastName"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户名：" prop="firstName" class="fl">
            <el-input
              v-model="orderData.firstName"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="国家：" prop="countryEn" class="fl">
            <el-select
              v-model="orderData.countryEn"
              placeholder="请选择"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              filterable
            >
              <el-option
                v-for="item in orderData.countryList"
                :key="item.countryEnName"
                :label="item.countryName"
                :value="item.countryEnName"
              >
              </el-option>
              <el-option
                v-for="item in orderData.countryList"
                :key="item.countryEnName"
                :label="item.countryEnName"
                :value="item.countryEnName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司：" class="fl">
            <el-input
              v-model="orderData.company"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="cityLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone" class="fl">
            <el-input
              v-model="orderData.phone"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="nameLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="省/州：" class="fl">
            <el-input
              v-model="orderData.state"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="nameLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="税号：" class="fl">
            <el-input
              v-model="orderData.taxNum"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="shuiLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮编：" prop="postcode" class="fl">
            <el-input
              v-model="orderData.postcode"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="postLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="城市：" class="fl">
            <el-input
              v-model="orderData.city"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="cityLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址1：" prop="street1" class="fl longInput">
            <el-input
              v-model="orderData.street1"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="addressLength"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址2：" class="fl longInput">
            <el-input
              v-model="orderData.street2"
              @input="addressChange"
              :disabled="canChangeDisabled && orderData.packageStatus != 0"
              :maxlength="addressLength"
            ></el-input>
          </el-form-item>
        </el-form>
      </li>
      <li
        class="orderDetailList declareInfoList"
        id="VOs"
        v-if="orderData.packageRels"
      >
        <div class="orderDetailTitle">
          报关信息
          <span class="OVClass"
            >总价格({{ orderData.packageRels[0]?.currency }}):{{
              VOsPrice
            }}</span
          ><span class="OVClass">总重量(g):{{ VOsWeight }}</span>
        </div>
        <div class="tableContainer">
          <el-table
            :data="orderData.packageGoodsDetailsVOs"
            style="width: 100%; z-index: 1"
          >
            <el-table-column
              prop="mainImg"
              width="80"
              align="center"
              label="主图"
            >
              <template #default="scope">
                <div class="itemsImagesContainer">
                  <el-popover
                    placement="right-start"
                    trigger="hover"
                    width="auto"
                  >
                    <el-image
                      style="width: 200px; height: 200px"
                      :src="scope.row.mainImg"
                      fit="contain"
                    ></el-image>
                    <template #reference>
                      <el-image
                        style="width: 70px; height: 70px"
                        :src="scope.row.mainImg"
                        fit="contain"
                      ></el-image>
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuCode"
              align="center"
              label="商品SKU"
              width="239"
            >
            </el-table-column>
            <el-table-column prop="customsInfoCn" width="150" align="center">
              <template #header>
                <span class="colorRed">*</span><span>中文报关名</span>
              </template>
              <template #default="scope">
                <el-input
                  v-model="scope.row.customsInfoCn"
                  @blur="tipsEmpty(scope.row.customsInfoCn, '中文报关名')"
                  :disabled="canChangeDisabled"
                  :maxlength="declareLength"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="customsInfoEn" width="150" align="center">
              <template #header>
                <span class="colorRed">*</span><span>英文报关名</span>
              </template>
              <template #default="scope">
                <el-input
                  v-model="scope.row.customsInfoEn"
                  :disabled="canChangeDisabled"
                  :maxlength="declareLength"
                  @blur="tipsEmpty(scope.row.customsInfoEn, '英文报关名')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="customsWeight" align="center" width="140">
              <template #header>
                <span class="colorRed">*</span><span>重量(g)</span>
              </template>
              <template #default="scope">
                <el-input-number
                  :precision="2"
                  v-model="scope.row.customsWeight"
                  :disabled="canChangeDisabled"
                  controls-position="right"
                  style="width: 110px"
                  :min="0"
                  :max="999999.99"
                  @blur="pWeightPrice(scope.row.customsWeight, 1)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="customsAmount" width="140">
              <template #header>
                <span class="colorRed">*</span
                ><span>价格({{ orderData.packageRels[0]?.currency }})</span>
              </template>
              <template #default="scope">
                <el-input-number
                  :precision="2"
                  style="width: 110px"
                  v-model="scope.row.customsAmount"
                  @blur="pWeightPrice(scope.row.customsAmount, 0)"
                  controls-position="right"
                  :min="0"
                  :max="999999.99"
                  :disabled="canChangeDisabled"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              prop="customsMatetial"
              width="110"
              align="center"
              label="材质"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.customsMatetial"
                  :disabled="canChangeDisabled"
                  :maxlength="shuiLength"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="customsPurpose"
              align="center"
              width="110"
              label="用途"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.customsPurpose"
                  :disabled="canChangeDisabled"
                  :maxlength="shuiLength"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="customsCode"
              align="center"
              width="135"
              label="海关编码"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.customsCode"
                  :disabled="canChangeDisabled"
                  :maxlength="shuiLength"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="attr" width="160" label="报关属性">
              <template #default="scope">
                <div class="selectContainer">
                  <el-checkbox-group
                    v-model="scope.row.attrCheckedList"
                    :disabled="canChangeDisabled"
                  >
                    <el-checkbox
                      v-for="vals in scope.row.attr"
                      :label="vals.name"
                      :key="vals.name"
                      @change="
                        checkboxGroup(scope.row.attr, scope.row.id, vals.name)
                      "
                    >
                      {{ vals.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-select
                    size="small"
                    v-if="scope.row.attr && scope.row.attr[0]"
                    v-model="scope.row.attr[0].childrenChecked"
                    placeholder="请选择"
                    class="mySelect"
                    style="width: 80px"
                    :disabled="canChangeDisabled"
                  >
                    <el-option
                      v-for="vals in scope.row.attr[0].children"
                      :key="vals.name"
                      :label="vals.name"
                      :value="vals.name"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li
        class="orderDetailList orderItemsList"
        id="orderDetail"
        v-if="orderData.packageRels"
      >
        <div class="orderDetailTitle">订单商品</div>
        <div class="tableContainer clearfix">
          <el-table
            class="fl mtNone"
            :data="orderData.packageRels"
            border
            style="width: 700px; z-index: 1"
          >
            <el-table-column prop="orderId" label="订单号" width="190">
              <template #default="scope">
                <div class="blueColor">
                  {{ scope.row.orderId }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="packageSkus" label="订单商品" width="510">
              <template #default="scope">
                <div
                  class="orderItemsContent clearfix"
                  v-for="item in scope.row.packageSkus"
                  :key="item.packageSkuId"
                  :style="item.isShow ? 'display: none;' : ''"
                >
                  <div class="orderItemsImageContainer">
                    <el-popover
                      placement="right-start"
                      trigger="hover"
                      width="auto"
                    >
                      <el-image
                        style="width: 200px; height: 200px"
                        :src="item.skuImg"
                        fit="contain"
                      ></el-image>
                      <template #reference>
                        <el-image
                          class="ml-10"
                          style="width: 70px; height: 70px"
                          :src="item.skuImg"
                          fit="contain"
                        ></el-image>
                      </template>
                    </el-popover>
                    <div
                      class="unmatched"
                      v-if="
                        !item.packageGoods.length &&
                        (orderData.packageStatus == 0 ||
                          orderData.packageStatus == 1) &&
                        item.quantity > 0
                      "
                    >
                      未匹配
                    </div>
                  </div>
                  <div class="orderItemsInfoContainer">
                    <el-tooltip placement="top" :offset="10">
                      <template #content>
                        <a style="color: #fff" v-copy="item.spuName">复制</a>
                      </template>
                      <p class="itemTitle" :title="item.spuName">
                        {{ item.spuName }}
                      </p>
                    </el-tooltip>
                    <p class="itemPrice">
                      {{ orderData.packageRels[0]?.currency }} {{ item.price }}
                    </p>
                    <div
                      v-if="!item.customization == 1 && item.skuValue"
                      class="itemSpec"
                    >
                      <p v-for="(v, i) in JSON.parse(item.skuValue)" :key="i">
                        {{ v.spe }}：{{ v.speVal + ' ' }}
                      </p>
                    </div>
                    <p
                      class="itemSpec"
                      v-if="item.customization == 1"
                      style="color: #1890ff; cursor: pointer"
                      @click="customInfoFn(item)"
                    >
                      定制{{item.taggedFlag == 1 ? '（普）' : ''}}
                    </p>
                  </div>

                  <div
                    class="goodsNumContainer"
                    :style="
                      item.packageGoods?.length > 0 &&
                      orderData.packageStatus == 1
                        ? 'line-height: 30px'
                        : 'line-height: 70px'
                    "
                  >
                    x{{ item.quantity }}
                    <p
                      v-if="
                        item.isShow != 1 &&
                        item.packageGoods?.length > 0 &&
                        item.packageGoods.some(
                          val =>
                            (val.checkStatus === 0 || val.checkStatus === 1) &&
                            val.currentFlag === 0
                        )
                      "
                    >
                      <el-button
                        type="text"
                        v-permission="'orderManagement/cancelMatch'"
                        @click="dissolutionFn(item)"
                        :disabled="
                          item.packageGoods[0]?.exportId > 0 &&
                          item.packageGoods[0]?.customization == 1
                        "
                        v-if="
                          (orderData.packageStatus == 1 ||
                            orderData.packageStatus == 0) &&
                          orderData.layFlag != 1
                        "
                      >
                        解除匹配
                      </el-button>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="tableRightContainer fr">
            <div
              class="rightTableHeader clearfix"
              style="background-color: #ebeef5"
            >
              <span class="rightTableHeaderTitle fl">发货仓库</span>
              <div class="fl">
                <el-select
                  v-model="value"
                  placeholder="请选择"
                  :disabled="canChangeDisabled"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <span
                class="fr blueColor"
                v-if="
                  !canChangeDisabled &&
                  authPath('addGoodsBtn') &&
                  (orderData.packageStatus == 1 || orderData.packageStatus == 3)
                "
                @click="chooseFn(false, false, false, 1, 0)"
                >+ 增加商品</span
              >
            </div>
            <ul class="rightTableBody">
              <li
                class="rightTableList clearfix"
                v-for="item in orderData.packageRels"
                :key="item.orderId"
              >
                <div v-for="key in item.packageSkus" :key="key.sku">
                  <div v-if="key.packageSkuMatch">
                    <div class="clearfix">
                      <div v-if="key.packageSkuMatch.operation != 3">
                        <div class="rightTableListImageContainer fl">
                          <el-popover
                            placement="right-start"
                            trigger="hover"
                            width="auto"
                          >
                            <el-image
                              style="width: 200px; height: 200px"
                              :src="key.packageSkuMatch.mainImg"
                              fit="contain"
                            ></el-image>
                            <template #reference>
                              <el-image
                                class="ml-10"
                                style="width: 70px; height: 70px"
                                :src="key.packageSkuMatch.mainImg"
                                fit="contain"
                              ></el-image>
                            </template>
                          </el-popover>
                          <div class="giftContainer" v-if="key.packageGoods[0]?.giftFlag == 1">
                            赠
                          </div>
                          <el-button
                            class="replaceBtn"
                            size="mini"
                            v-if="
                              key.packageGoods.some(l => l.goodAttribute == 3)
                            "
                            >替代</el-button
                          >
                          <el-button
                            class="replaceBtn yellowBtn"
                            size="mini"
                            v-else-if="
                              key.packageGoods.some(l => l.goodAttribute == 2)
                            "
                            >相似</el-button
                          >
                        </div>
                        <div class="rightTableListItemInfoContainer fl">
                          <div class="rightTableListItemInfo">
                            <p
                              class="rightTableListItemInfoTitle"
                              :title="key.packageSkuMatch.skuCode"
                            >
                              {{ key.packageSkuMatch.skuCode }}
                            </p>
														<p
                              class="rightTableListItemInfoTitle"
                              :title="key.packageSkuMatch.skuId"
                            >
                              SKU ID：{{ key.packageSkuMatch.skuId }}
                            </p>
                            <p
                              class="rightTableListItemInfoSpev rightTableListItemInfoTitle"
                              :title="skuShow(key.packageSkuMatch.skuValue)"
                            >
                              {{ skuShow(key.packageSkuMatch.skuValue) }}
                            </p>
                            <p class="rightTableListItemInfoPrice rightTableListItemInfoTitle">
                              CNY：{{
                                key.packageSkuMatch.purchasePrice ||
                                key.packageSkuMatch.declareAmount ||
                                '0.00'
                              }}<span>&nbsp;&nbsp;&nbsp;&nbsp;货架位：{{key.packageSkuMatch.shelfGridName||'-'}}</span>
                            </p>
                          </div>
                          <div class="rightTableListItemTool">
                            <el-input-number
                              style="width: 110px"
                              v-model="key.packageSkuMatch.quantity"
                              controls-position="right"
                              :max="999"
                              :step="1"
                              step-strictly
                              :min="1"
                              @blur="inputBlur(key.packageSkuMatch.quantity)"
                              @change="nunmberChange(key)"
                              :disabled="
                                key.packageGoods[0]?.exportId > 0 ||
                                !(
                                  orderData.packageStatus == 1 ||
                                  orderData.packageStatus == 3
                                )
                              "
                            >
                            </el-input-number>
                          </div>
                          <div class="rightTableListItemTool">
                            <p
                              class="rightTableListItemToolBtn"
                              style="margin-top: 0"
                            >
                              <el-popover
                                placement="left-start"
                                trigger="hover"
                                width="auto"
                              >
                                <SingleItem
                                  :quantity="key.packageSkuMatch.quantity"
                                  :list="
                                    key.packageGoods.filter(
                                      vl => !vl.combineType
                                    )
                                  "
                                />
                                <template #reference>
                                  <el-button type="text">查看单品</el-button>
                                </template>
                              </el-popover>
                            </p>
                            <div
                              v-if="
                                orderData.packageStatus == 0 ||
                                orderData.packageStatus == 1 ||
                                orderData.packageStatus == 3
                              "
                            >
                              <div
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  orderData.packageStatus == 1 &&
                                  authPath('changeGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <el-popover
                                  placement="left-start"
                                  trigger="hover"
                                  width="auto"
                                >
                                  <p style="text-align: center">
                                    <el-button
                                      type="text"
                                      @click="
                                        chooseFn(
                                          key.packageSkuMatch.id,
                                          key.packageSkuMatch.skuId,
                                          2,
                                          key.packageSkuMatch.quantity,
                                          1
                                        )
                                      "
                                      >更换当前包裹</el-button
                                    >
                                  </p>
                                  <p style="text-align: center">
                                    <el-button
                                      type="text"
                                      @click="
                                        chooseFn(
                                          key.packageSkuMatch.id,
                                          key.packageSkuMatch.skuId,
                                          2,
                                          key.packageSkuMatch.quantity,
                                          2
                                        )
                                      "
                                      >更换所有包裹</el-button
                                    >
                                  </p>
                                  <template #reference>
                                    <el-button
                                      type="text"
                                      :disabled="
                                        key.packageGoods?.some(
                                          v =>
                                            v.exportId > 0 &&
                                            v.customization == 1
                                        )
                                      "
                                      >更换</el-button
                                    >
                                  </template>
                                </el-popover>
                              </div>
                              <div
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  orderData.packageStatus == 3 &&
                                  authPath('changeGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <el-button
                                  type="text"
                                  :disabled="key.packageGoods[0]?.exportId > 0"
                                  @click="
                                    chooseFn(
                                      key.packageSkuMatch.id,
                                      key.packageSkuMatch.skuId,
                                      2,
                                      key.packageSkuMatch.quantity,
                                      3
                                    )
                                  "
                                  >更换</el-button
                                >
                              </div>

                              <p
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  (orderData.packageStatus == 1 ||
                                    orderData.packageStatus == 3)
                                "
                                style="margin-top: 0"
                                :style="
                                  key.packageGoods[0]?.giftFlag == 1
                                    ? 'color:#333;'
                                    : 'color:#1890FF;'
                                "
                              >
                                <el-button
                                  type="text"
                                  @click="
                                    setGift(
                                      key.packageSkuMatch.id,
                                      key.packageSkuMatch.skuId,
                                      2
                                    )
                                  "
                                  >{{
                                    key.packageGoods[0]?.giftFlag == 1
                                      ? '取消赠品'
                                      : '设为赠品'
                                  }}</el-button
                                >
                              </p>
                              <p
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  (orderData.packageStatus == 1 ||
                                    orderData.packageStatus == 3) &&
                                  authPath('deleteGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <el-button
                                  type="text"
                                  :disabled="key.packageGoods[0]?.exportId > 0"
                                  @click="
                                    delChooseGoods(
                                      key.packageSkuMatch.id,
                                      key.packageSkuMatch.skuId,
                                      2
                                    )
                                  "
                                  >删除</el-button
                                >
                              </p>
                              <p
                                class="unmatchedBtns"
                                v-if="
                                  orderData.packageStatus == 0 &&
                                  key.packageSkuMatch &&
                                  authPath('orderManagement/matchGoodsAgain')
                                "
                                :class="
                                  orderData.layFlag == 1 ||
                                  orderData.forbidFlag == 1
                                    ? 'unmatchedBtnsGray'
                                    : ''
                                "
                              >
                                <el-button
                                  type="text"
                                  @click="
                                    matchShow(
                                      key.sku,
                                      0,
                                      key.packageSkuMatch.currentFlag == 1
                                        ? 2
                                        : 1,
                                      key
                                    )
                                  "
                                  >重新匹配</el-button
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="
                      (key.packageGoods.length && !key.packageSkuMatch) ||
                      key.packageGoods?.some(value => !value.combineType)
                    "
                  >
                    <div
                      v-for="(v, i) in key.packageGoods"
                      :key="v.goodsId"
                      class="clearfix"
                    >
                      <div
                        v-if="
                          v.operation != 3 &&
                          ((key.packageSkuMatch && v.combineType) ||
                            !key.packageSkuMatch)
                        "
                      >
                        <div class="rightTableListImageContainer fl">
                          <el-popover
                            placement="right-start"
                            trigger="hover"
                            width="auto"
                          >
                            <el-image
                              style="width: 200px; height: 200px"
                              :src="v.mainImg"
                              fit="contain"
                            ></el-image>
                            <template #reference>
                              <el-image
                                class="ml-10"
                                style="width: 70px; height: 70px"
                                :src="v.mainImg"
                                fit="contain"
                              ></el-image>
                            </template>
                          </el-popover>
                          <div class="giftContainer" v-if="v.giftFlag == 1">
                            赠
                          </div>
                          <el-button
                            class="replaceBtn"
                            size="mini"
                            v-if="v.goodAttribute == 3"
                            >替代</el-button
                          >
                          <el-button
                            class="replaceBtn yellowBtn"
                            size="mini"
                            v-else-if="v.goodAttribute == 2"
                            >相似</el-button
                          >
                        </div>
                        <div class="rightTableListItemInfoContainer fl">
                          <div class="rightTableListItemInfo">
                            <p
                              class="rightTableListItemInfoTitle"
                              :title="v.skuCode"
                            >
                              {{ v.skuCode }}
                            </p>
														<p class="rightTableListItemInfoTitle"
                              :title="v.skuId">SKU ID：{{v.skuId}}</p>
                            <p
                              class="rightTableListItemInfoSpev rightTableListItemInfoTitle"
                              :title="skuShow(v.skuValue)"
                            >
                              {{ skuShow(v.skuValue) }}
                            </p>
                            <p class="rightTableListItemInfoPrice rightTableListItemInfoTitle">
                              CNY：{{
                                v.purchasePrice || v.declareAmount || '0.00'
                              }}
															<span>&nbsp;&nbsp;&nbsp;&nbsp;货架位：{{v.shelfGridName||"-"}}</span>
                            </p>

                            <p
                              class="rightTableListItemInfoPrice rightTableListItemInfoTitle"
                              v-if="v.combineType != 2"
                            >
                              在仓库存：<span class="redColor">{{
                                v.stockQuantity || 0
                              }}</span
                              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到货：<span
                                style="color: #67c23a"
                                >{{ v.matchQuantity || 0 }}</span
                              >
                            </p>
                          </div>
                          <div class="rightTableListItemTool">
                            <el-input-number
                              style="width: 110px"
                              v-model="v.goodsQuantity"
                              controls-position="right"
                              :max="999"
                              :step="1"
                              step-strictly
                              :min="1"
                              @blur="inputBlur(v.goodsQuantity)"
                              @change="nunmberChange(v)"
                              :disabled="
                                (v.exportId > 0 && v.customization == 1) ||
                                !(
                                  orderData.packageStatus == 1 ||
                                  orderData.packageStatus == 3
                                )
                              "
                            >
                            </el-input-number>
                          </div>
                          <div class="rightTableListItemTool">
                            <div
                              class="rightTableListItemToolBtn"
                              style="margin-top: 0"
                              v-if="v.combineType == 2"
                            >
                              <el-popover
                                placement="left-start"
                                trigger="hover"
                                width="auto"
                              >
                                <SingleItem
                                  :quantity="v.goodsQuantity"
                                  :list="v.childGoodsBases"
                                />
                                <template #reference>
                                  <el-button type="text">查看单品</el-button>
                                </template>
                              </el-popover>
                            </div>
                            <div
                              v-if="
                                orderData.packageStatus == 0 ||
                                orderData.packageStatus == 1 ||
                                orderData.packageStatus == 3
                              "
                            >
                              <div
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  orderData.packageStatus == 1 &&
                                  authPath('changeGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <!-- 包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、
															6带打单缺货、7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功 -->
                                <el-popover
                                  placement="left-start"
                                  trigger="hover"
                                  width="auto"
                                >
                                  <p style="text-align: center">
                                    <el-button
                                      type="text"
                                      @click="
                                        chooseFn(
                                          v.id,
                                          v.skuId,
                                          1,
                                          v.goodsQuantity,
                                          1
                                        )
                                      "
                                      >更换当前包裹</el-button
                                    >
                                  </p>
                                  <p style="text-align: center">
                                    <el-button
                                      type="text"
                                      @click="
                                        chooseFn(
                                          v.id,
                                          v.skuId,
                                          1,
                                          v.goodsQuantity,
                                          2
                                        )
                                      "
                                      >更换所有包裹</el-button
                                    >
                                  </p>
                                  <template #reference>
                                    <el-button
                                      type="text"
                                      :disabled="
                                        v.exportId > 0 && v.customization == 1
                                      "
                                      >更换</el-button
                                    >
                                  </template>
                                </el-popover>
                              </div>
                              <div
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  orderData.packageStatus == 3 &&
                                  authPath('changeGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <el-button
                                  type="text"
                                  :disabled="
                                    v.exportId > 0 && v.customization == 1
                                  "
                                  @click="
                                    chooseFn(
                                      v.id,
                                      v.skuId,
                                      1,
                                      v.goodsQuantity,
                                      3
                                    )
                                  "
                                  >更换</el-button
                                >
                              </div>
                              <p
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  (orderData.packageStatus == 1 ||
                                    orderData.packageStatus == 3)
                                "
                                style="margin-top: 0"
                                :style="
                                  v.giftFlag == 1
                                    ? 'color:#333;'
                                    : 'color:#1890FF;'
                                "
                              >
                                <el-button
                                  type="text"
                                  @click="setGift(v.id, v.skuId, 1)"
                                  >{{
                                    v.giftFlag == 1 ? '取消赠品' : '设为赠品'
                                  }}</el-button
                                >
                              </p>
                              <p
                                class="rightTableListItemToolBtn"
                                v-if="
                                  !canChangeDisabled &&
                                  (orderData.packageStatus == 1 ||
                                    orderData.packageStatus == 3) &&
                                  authPath('deleteGoodsBtn')
                                "
                                style="margin-top: 0"
                              >
                                <el-button
                                  type="text"
                                  :disabled="
                                    v.exportId > 0 && v.customization == 1
                                  "
                                  @click="
                                    delChooseGoods(
                                      v.id,
                                      v.skuId,
                                      v.combineType || 1
                                    )
                                  "
                                  >删除</el-button
                                >
                              </p>
                              <p
                                class="unmatchedBtns"
                                v-if="
                                  orderData.packageStatus == 0 &&
                                  v.checkStatus == 0 &&
                                  authPath('orderManagement/matchGoodsAgain')
                                "
                                :class="
                                  orderData.layFlag == 1 ||
                                  orderData.forbidFlag == 1
                                    ? 'unmatchedBtnsGray'
                                    : ''
                                "
                              >
                                <span
                                  v-if="i == key.packageGoods.length - 1"
                                  @click="
                                    matchShow(
                                      key.sku,
                                      key.customization,
                                      1,
                                      key
                                    )
                                  "
                                  >重新匹配</span
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="unmatchedBtns"
                    :class="
                      orderData.layFlag == 1 || orderData.forbidFlag == 1
                        ? 'unmatchedBtnsGray'
                        : ''
                    "
                    v-if="
                      !key.packageGoods.length &&
                      (orderData.packageStatus == 0 ||
                        orderData.packageStatus == 3) &&
                      authPath('orderManagement/matchGoods') &&
                      key.quantity > 0
                    "
                  >
                    <span @click="matchShow(key.sku, key.customization, 1, key)"
                      >匹配</span
                    >
                  </div>
                  <!-- 1、待处理订单，若订单商品解除匹配后，删除发货商品并显示【匹配】按钮，可以重新匹配商品 -->
                  <div
                    class="unmatchedBtns"
                    v-if="
                      orderData.packageStatus == 1 &&
                      (key.packageGoods.length == 0 ||
                        key.packageGoods.every(a => !a.packageSkuId)) &&
                      authPath('orderManagement/matchGoods') &&
                      key.quantity > 0
                    "
                  >
                    <el-popover
                      placement="right-start"
                      trigger="hover"
                      width="auto"
                    >
                      <div>
                        <el-button
                          type="text"
                          @click="matchShow(key.sku, key.customization, 2, key)"
                          >匹配当前包裹</el-button
                        ><br />
                        <el-button
                          type="text"
                          @click="matchShow(key.sku, key.customization, 3, key)"
                          >匹配所有包裹</el-button
                        >
                      </div>
                      <template #reference>
                        <el-button type="text">匹配</el-button>
                      </template>
                    </el-popover>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <MatchOrder
          v-if="matchOrderShow"
          :dialogVisible="matchOrderShow"
          dialogTitle="选择商品"
          :returnStatus="returnStatus"
          :data="matchData"
          @initPages="initPages"
          @close="close"
          :matchingStatus="matchingStatus"
          :packageSkuId="packageSkuId"
          :excludeSkuIds="excludeSkuIds"
          :orderStatus="orderData.packageStatus"
        />
      </li>
      <li class="orderDetailList orderInfoList threeList" id="orderInfo">
        <div class="orderDetailTitle clearfix">
          <span class="fl">订单信息</span>
          <div class="fr" style="margin-right: 15px">
            <el-radio v-model="moneyType" label="1" @change="changeRadio"
              >原始货币</el-radio
            >
            <el-radio
              v-model="moneyType"
              label="2"
              @change="changeRadio"
              style="margin-left: 20px"
              >人民币</el-radio
            >
          </div>
        </div>
        <div v-for="(item, index) in orderData.packageRels" :key="item.orderId">
          <el-form class="demo-ruleForm clearfix">
            <el-form-item label="订单号：" class="fl">
              <el-tooltip
                v-if="item.orderId"
                class="item"
                effect="light"
                :content="item.orderId"
                placement="top"
              >
                <p class="contentList">{{ item.orderId || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="包裹号：" prop="name" class="fl">
              <el-tooltip
                v-if="item.packageId"
                class="item"
                effect="light"
                :content="item.packageId"
                placement="top"
              >
                <p class="contentList">{{ item.packageId || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="订单类型：" class="fl">
              <el-tooltip
                v-if="item.typeName"
                class="item"
                effect="light"
                :content="item.typeName + ''"
                placement="top"
              >
                <p class="contentList">{{ item.typeName || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="订单来源：" class="fl">
              <el-tooltip
                v-if="item.source"
                class="item"
                effect="light"
                :content="item.source + ''"
                placement="top"
              >
                <p class="contentList">{{ item.source || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="订单金额：" class="fl">
              <el-tooltip
                v-if="orderInfo[index].totalPrice"
                class="item"
                effect="light"
                :content="orderInfo[index].totalPrice + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ orderInfo[index].totalPrice || ' ' }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="下单时间：" class="fl">
              <el-tooltip
                v-if="item.createTime"
                class="item"
                effect="light"
                :content="item.createTime + ''"
                placement="top"
              >
                <p class="contentList">{{ item.createTime || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="交易号：" class="fl">
              <el-tooltip
                v-if="item.transcationId"
                class="item"
                effect="light"
                :content="item.transcationId + ''"
                placement="top"
              >
                <p class="contentList">{{ item.transcationId || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="支付方式：" class="fl">
              <el-tooltip
                v-if="item.paymentMethod"
                class="item"
                effect="light"
                :content="item.paymentMethod + ''"
                placement="top"
              >
                <p class="contentList">{{ item.paymentMethod || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="付款时间：" class="fl">
              <el-tooltip
                v-if="item.paymentTime"
                class="item"
                effect="light"
                :content="item.paymentTime + ''"
                placement="top"
              >
                <p class="contentList">{{ item.paymentTime || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="货币：" class="fl">
              <el-tooltip
                v-if="orderInfo[index].currency"
                class="item"
                effect="light"
                :content="orderInfo[index].currency + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ orderInfo[index].currency || ' ' }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="商品总额：" class="fl">
              <el-tooltip
                v-if="orderInfo[index].totalItemPrice"
                class="item"
                effect="light"
                :content="orderInfo[index].totalItemPrice + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ orderInfo[index].totalItemPrice || ' ' }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="税收金额：" class="fl">
              <el-tooltip
                v-if="orderInfo[index].taxPrice"
                class="item"
                effect="light"
                :content="orderInfo[index].taxPrice + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ orderInfo[index].taxPrice || ' ' }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="退款金额：" class="fl">
              <el-tooltip
                v-if="orderInfo[index].refundPrice"
                class="item"
                effect="light"
                :content="orderInfo[index].refundPrice + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ orderInfo[index].refundPrice }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="退款时间：" class="fl">
              <el-tooltip
                v-if="orderData.packageRefunds?.length"
                class="item"
                effect="light"
                :content="item.lastRefundTime + ''"
                placement="top"
              >
                <p class="contentList">
                  {{ item.lastRefundTime }}
                </p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="买家指定物流：" class="fl">
              <el-tooltip
                v-if="item.shippingsName"
                class="item"
                effect="light"
                :content="item.shippingsName + ''"
                placement="top"
              >
                <p class="contentList">{{ item.shippingsName || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
            <el-form-item label="买家备注：" class="fl longInput textAreaTitle">
              <el-tooltip
                v-if="item.remark"
                class="item"
                effect="light"
                :content="item.remark + ''"
                placement="top"
              >
                <p class="contentList">{{ item.remark || ' ' }}</p>
              </el-tooltip>
              <p class="contentList" v-else></p>
            </el-form-item>
          </el-form>
        </div>
      </li>
      <li class="orderDetailList threeList" id="shipping">
        <div class="orderDetailTitle shippingContent">
          <div class="title-name">物流信息</div>
          <div
            class="reson-content redColor"
            v-if="
              orderData.packageStatus == 3 ||
              (orderData.packageLogistics.applyStatus == 0 &&
                orderData.packageStatus == -1)
            "
            :title="orderData.packageLogistics.apiResponse"
          >
            运单号申请失败：{{ orderData.packageLogistics.apiResponse }}
          </div>
        </div>
        <el-form class="demo-ruleForm clearfix">
          <el-form-item label="运单号：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.trackNumber"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.trackNumber + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.trackNumber || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="物流方式：" class="fl top10">
            <el-input
              v-model="shippingName"
              @click="showShippingModal"
              :readonly="disabledInput"
              placeholder="请选择物流方式"
              style="height: 30px"
              :disabled="
                orderData.layFlag == 1 ||
                orderData.forbidFlag == 1 ||
                !(
                  orderData.packageStatus == 1 ||
                  orderData.packageStatus == 3 ||
                  orderData.packageStatus == 8 ||
                  orderData.packageStatus == -1
                )
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="面单状态：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.applyStatusText"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.applyStatusText + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.applyStatusText || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="运单号来源：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.trackTypeText"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.trackTypeText + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.trackTypeText || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="生成面单时间：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.generateTime"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.generateTime + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.generateTime || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="打单时间：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.printTime"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.printTime + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.printTime || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="发货时间：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.deliveryTime"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.deliveryTime + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.deliveryTime || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="重量（g）：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.deliveryWeight"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.deliveryWeight + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.deliveryWeight || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="签收时间：" class="fl">
            <el-tooltip
              v-if="orderData.packageLogistics.signTime"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.signTime + ''"
              placement="top"
            >
              <p class="contentList">
                {{ orderData.packageLogistics.signTime || ' ' }}
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="面单下载地址：" class="fl longInput">
            <el-tooltip
              v-if="orderData.packageLogistics.originalUrl"
              class="item"
              effect="light"
              :content="orderData.packageLogistics.originalUrl + ''"
              placement="top"
            >
              <p class="contentList">
                <a
                  target="_blank"
                  :href="orderData.packageLogistics.originalUrl"
                >
                  {{ orderData.packageLogistics.originalUrl || ' ' }}</a
                >
              </p>
            </el-tooltip>
            <p class="contentList" v-else></p>
          </el-form-item>
          <el-form-item label="物流轨迹：" class="fl longInput textAreaTitle">
            <div class="delivery">
              <el-timeline v-if="orderData.packageLogistics.tracks">
                <el-timeline-item
                  :color="i == 0 ? '#409EFF' : ''"
                  v-for="(item, i) in orderData.packageLogistics.tracks"
                  :key="i"
                >
                  {{ item.time }} {{ item.desc }}
                </el-timeline-item>
              </el-timeline>
              <!-- <p class="contentList" v-else></p> -->
            </div>
          </el-form-item>
        </el-form>
        <Logistics
          dialogTitle="选择物流方式"
          v-if="shippingModal"
          :defaultChecked="orderData.packageLogistics.logistics"
          :defaultValue="defaultValue"
          :dialogVisible="shippingModal"
          @changeData="changeData"
          width="640px"
          :data="shippingForm"
          :forbid="shippingModal"
          @closeModal="closeModalFn"
          :isAllMatching="isAllMatching"
        />
      </li>
      <li class="orderDetailList threeList" id="finance">
        <div class="orderDetailTitle">财务信息</div>
        <div v-for="(item, index) in orderData.packageFinances" :key="index">
          <el-form
            :model="item"
            :rules="customInfo.rules"
            ref="ruleForm"
            class="demo-ruleForm clearfix"
          >
            <el-form-item label="平台手续费：" class="fl">
              <p class="contentList" :title="(item.platformFee - 0).toFixed(2)">
                {{ item.platformFee !== null ? 'CNY' : '' }}
                {{
                  item.platformFee === null
                    ? ' '
                    : (item.platformFee - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="交易手续费：" class="fl">
              <p
                class="contentList"
                :title="(item.transactionFee - 0).toFixed(2)"
              >
                {{ item.transactionFee !== null ? 'CNY' : '' }}
                {{
                  item.transactionFee === null
                    ? ' '
                    : (item.transactionFee - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="预估采购费用：" class="fl">
              <p
                class="contentList"
                :title="(item.estimatePurchaseFee - 0).toFixed(2)"
              >
                {{ item.estimatePurchaseFee !== null ? 'CNY' : '' }}
                {{
                  item.estimatePurchaseFee === null
                    ? ' '
                    : (item.estimatePurchaseFee - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="预估物流费用：" class="fl">
              <p
                class="contentList"
                :title="(item.estimateLogisticsFee - 0).toFixed(2)"
              >
                {{ item.estimateLogisticsFee !== null ? 'CNY' : '' }}
                {{
                  item.estimateLogisticsFee === null
                    ? ' '
                    : (item.estimateLogisticsFee - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="采购成本：" class="fl">
              <p
                class="contentList"
                :title="(item.purchaseCost - 0).toFixed(2)"
              >
                {{ item.purchaseCost !== null ? 'CNY' : '' }}
                {{
                  item.purchaseCost === null
                    ? ' '
                    : (item.purchaseCost - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="物流成本：" class="fl">
              <p
                class="contentList"
                :title="(item.logisticsCost - 0).toFixed(2)"
              >
                {{ item.logisticsCost !== null ? 'CNY' : '' }}
                {{
                  item.logisticsCost === null
                    ? ' '
                    : (item.logisticsCost - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="其他成本：" class="fl">
              <p class="contentList" :title="(item.otherCost - 0).toFixed(2)">
                {{ item.otherCost !== null ? 'CNY' : '' }}
                {{
                  item.otherCost === null
                    ? ' '
                    : (item.otherCost - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="预估利润：" class="fl">
              <p
                class="contentList"
                :title="(item.estimateProfit - 0).toFixed(2)"
              >
                {{ item.estimateProfit !== null ? 'CNY' : '' }}
                {{
                  item.estimateProfit === null
                    ? ' '
                    : (item.estimateProfit - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
            <el-form-item label="实际利润：" class="fl">
              <p
                class="contentList"
                :title="(item.actualProfit - 0).toFixed(2)"
              >
                {{ item.actualProfit !== null ? 'CNY' : '' }}
                {{
                  item.actualProfit === null
                    ? ' '
                    : (item.actualProfit - 0).toFixed(2)
                }}
              </p>
            </el-form-item>
          </el-form>
        </div>
      </li>
      <li
        class="orderDetailList"
        id="returnBack"
        v-permission="'orderManagement/refundedInfo'"
        v-if="orderData.packageRels"
      >
        <div class="orderDetailTitle shippingContent">
          <div class="title-name">退款信息</div>
          <div class="reson-content">
            退款总额：<span class="redColor"
              >{{ orderData.packageRefunds[0]?.payCurrency }}
              {{ returnTotal(orderData.packageRefunds) }}</span
            >
          </div>
        </div>
        <el-table :data="orderData.packageRefunds">
          <el-table-column
            prop="createTime"
            width="190"
            align="center"
            label="退款时间"
          >
          </el-table-column>
          <el-table-column
            prop="orderId"
            width="190"
            align="center"
            label="订单号"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="goods"
            width="190"
            align="center"
            label="退款商品"
          >
          </el-table-column> -->
          <el-table-column
            prop="amount"
            width="150"
            align="center"
            label="退款金额"
          >
            <template #default="scope">
              <div>
                {{ scope.row.payCurrency }}
                {{ (scope.row.amount - 0).toFixed(2) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="reason" align="center" label="退款原因">
          </el-table-column>
          <el-table-column
            prop="createBy"
            width="100"
            align="center"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            width="100"
            align="center"
            label="状态"
          >
            <template #default="scope">
              <div>
                {{ scope.row.status == 1 ? '失败' : '成功' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" align="center" label="退款备注">
          </el-table-column>
        </el-table>
      </li>
      <li
        class="orderDetailList"
        id="remarks"
        v-if="orderData.packageStatus != 9"
      >
        <div class="orderDetailTitle clearfix">
          <span class="fl">备注信息</span>
          <el-button
            type="text"
            class="fr"
            style="margin: 13px 30px 0 0"
            @click="addRemarkFn('', '')"
            v-if="orderData.packageStatus != 2"
            >+ 添加</el-button
          >
        </div>
        <el-table :data="orderData.packageRemarks" style="width: 100%">
          <el-table-column
            prop="content"
            width="308px"
            align="center"
            label="内容"
          >
            <template #default="scope">
              <div class="">
                {{ scope.row.content }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" align="center" label="更新时间">
          </el-table-column>
          <!-- <el-table-column prop="updateBy" align="center" label="更新人">
          </el-table-column> -->
          <el-table-column prop="createTime" align="center" label="创建时间">
          </el-table-column>
          <el-table-column prop="createBy" align="center" label="创建人">
          </el-table-column>
          <el-table-column prop="typeId" align="center" label="类型">
            <template #default="scope">
              <div>
                {{
                  remarkTypeList.filter(v => v.id == scope.row.typeId)[0]?.name
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" align="center" label="操作">
            <template #default="scope">
              <div class="blueColor">
                <el-button
                  type="text"
                  style="color: #409eff"
                  :style="scope.row.createById != userId ? 'color:#989BA1' : ''"
                  :disabled="scope.row.createById != userId"
                  :dataid="scope.row.id"
                  @click="addRemarkFn(scope.row.id, scope.row.typeId)"
                  v-if="orderData.packageStatus != 2"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  style="color: #f56c6c"
                  :style="scope.row.createById != userId ? 'color:#989BA1' : ''"
                  :disabled="scope.row.createById != userId"
                  @click="deleteFn(scope.row.id)"
                  v-if="orderData.packageStatus != 2"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="remarkShow">
          <el-dialog
            title="订单备注"
            v-model="remarkShow"
            width="640px"
            :close-on-click-modal="closeModal"
            :before-close="closeRemarkFn"
          >
            <div class="tipsContent remarkDialog">
              <div class="clearfix" style="line-height: 36px">
                <div class="fl tipsContentTitle">备注类型：</div>
                <div class="fl" style="width: 530px">
                  <el-radio
                    v-for="item in remarkTypeList"
                    :key="item.id"
                    v-model="remarkType"
                    :label="item.id"
                    >{{ item.name }}</el-radio
                  >
                </div>
              </div>
              <div class="clearfix remarkConatienr">
                <div class="fl tipsContentTitle">备注内容：</div>
                <div class="fl">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    maxlength="100"
                    show-word-limit
                    v-model="remarkText"
                  >
                  </el-input>
                </div>
              </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="closeRemarkFn">取 消</el-button>
                <el-button type="primary" @click="sureRemarkFn"
                  >确 定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </div>
        <el-dialog
          title="删除提示"
          v-model="delRemarkShow"
          width="420px"
          :close-on-click-modal="closeModal"
          :before-close="closeDelRemarkFn"
        >
          <div class="tipsContent">
            <i class="el-icon-warning"></i>是否确定删除该备注信息？
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="closeDelRemarkFn">取 消</el-button>
              <el-button type="primary" @click="sureDelRemarkFn"
                >确 定</el-button
              >
            </span>
          </template>
        </el-dialog>
      </li>
      <li class="orderDetailList" id="logs" ref="customInfoList">
        <div class="orderDetailTitle">操作日志</div>
        <el-table :data="logsData.dataList" style="width: 100%">
          <el-table-column prop="logsContent" align="center" label="操作内容">
            <template #default="scope">
              <div>
                <span>{{ scope.row.content }}</span>
                <span class="blueColor">{{ scope.row.type }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" align="center" label="操作人">
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="操作时间">
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="clearfix">
          <div class="fr">
            <el-pagination
              style="margin-top: 15px"
              @size-change="changeUserListSize"
              @current-change="changeUserListCurrent"
              :current-page="checkLogs.page.pageNo"
              :page-sizes="paginationArr"
              :page-size="checkLogs.page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="logsData.totalCount"
            >
            </el-pagination>
          </div>
        </div>
      </li>
    </ul>
    <div class="orderDetailFooter clearfix" v-if="orderData.packageRels">
      <span class="fl"
        >包裹总额：{{ orderData.packageRels[0]?.currency }}
        {{ orderData.totalPrice }}</span
      >
      <div class="fr">
        <!-- 包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功 -->
        <el-button
          v-if="!canChangeDisabled || orderData.packageStatus == 0"
          @click="backPrevFn"
        >
          取 消
        </el-button>
        <el-button
          v-if="canChangeDisabled && orderData.packageStatus != 0"
          @click="backPrevFn"
        >
          关 闭
        </el-button>

        <!--
          包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、
          7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功 10已退款
         -->

        <!-- 移入搁置:
         0待审核,1待处理,
         运单号申请(3申请失败/4申请成功),
         待打单(5有货/6缺货),
         7待发货,
         -->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 0 ||
              orderData.packageStatus == 1 ||
              orderData.packageStatus == 3 ||
              orderData.packageStatus == 4 ||
              orderData.packageStatus == 5 ||
              orderData.packageStatus == 6 ||
              orderData.packageStatus == 7) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/shelve')
          "
          @click="toShelveFn"
        >
          移入搁置
        </el-button>

        <!-- 审 核:0待审核（若当前包裹有商品未匹配，则按钮置灰）
         -->
        <el-button
          type="primary"
          v-if="
            orderData.packageStatus == 0 &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/examine')
          "
          :disabled="
            orderData.packageRels.some(v =>
              v.packageSkus.some(k => k.packageGoods.length == 0)
            )
          "
          @click="examineFn()"
        >
          审 核
        </el-button>

        <!-- 申请运单号：1待处理=>申请运单号（若当前包裹为未择物流方式，则提示：请选择物流方式！） -->
        <el-button
          type="primary"
          v-if="
            orderData.packageStatus == 1 &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/applyWayNum')
          "
          @click="applicationWaybillNo"
        >
          申请运单号
        </el-button>

        <!-- 重新获取:3申请失败 , -1更换物流待处理-->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 3 || orderData.packageStatus == -1) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/getAgain')
          "
          @click="reacquireFn"
        >
          重新获取
        </el-button>

        <!-- 打印面单:5待打单有货,-2更换待打单 -->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 5 || orderData.packageStatus == -2) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/print')
          "
          @click="printSheet"
        >
          打印面单
        </el-button>

        <!-- 打回待处理: 3申请失败,4申请成功,5待打单有货,6带打单缺货,-2更换待打单 -->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 3 ||
              orderData.packageStatus == 4 ||
              orderData.packageStatus == 5 ||
              orderData.packageStatus == 6 ||
              orderData.packageStatus == -2) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/logistic/pending')
          "
          @click="callBackToBeProcessed"
        >
          打回待处理
        </el-button>

        <!-- 移入待打单: 4申请成功,-1更换物流待处理,-3更换待发货,7待发货 -->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 4 ||
              orderData.packageStatus == 7 ||
              orderData.packageStatus == -1 ||
              orderData.packageStatus == -3) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/toPlay')
          "
          @click="moveInOrderToBePrinted"
        >
          {{orderData.packageStatus == 7 ? '打回':'移入'}}待打单
        </el-button>

        <!-- 补发赠品:6带打单缺货 （补发赠品页面点击【取消】或【保存】，仍返回当前包裹详情页）-->
        <el-button
          type="primary"
          v-if="
            orderData.packageStatus == 6 &&
            orderData.layFlag != 1 &&
            authPath('reissueGifts')
          "
          @click="reissueGifts"
        >
          补发赠品
        </el-button>

        <!-- 补打单: 7待发货,-3更换待发货-->
        <el-button
          type="primary"
					:disabled="orderData.packageLogistics.trackType ==1"
          v-if="
            (orderData.packageStatus == 7 || orderData.packageStatus == -3) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/reissuePrinted')
          "
          @click="makeUpSheet"
        >
          补打单
        </el-button>

        <!-- 补发包裹: 8已发货（补发包裹页面点击【取消】或【保存】，仍返回当前包裹详情页）-->
        <el-button
          type="primary"
          v-if="
            (orderData.packageStatus == 8 ||
              (orderData.packageStatus == -4 && isChangeLogist !== 'true')) &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/supply')
          "
          @click="reissuePackage"
        >
          补发包裹
        </el-button>

        <!-- 还原: layFlag == 1 -->
        <el-button
          type="primary"
          v-if="orderData.layFlag == 1 && authPath('orderManagement/reduction')"
          @click="reductionFn"
        >
          还原
        </el-button>

        <!-- 变更支付状态: 9未付款 -->
        <el-button
          type="primary"
          v-if="
            orderData.packageStatus == 9 &&
            orderData.layFlag != 1 &&
            authPath('orderManagement/changePayType')
          "
          @click="changePaymentShowClick"
        >
          变更支付状态
        </el-button>

        <!-- 退款:  -->
        <el-button
          type="primary"
          v-if="
            orderData.packageStatus != 9 &&
            (orderData.packageStatus > -1 || orderData.packageStatus == -4) &&
            orderData.packageRels
          "
          @click="refundOrder"
          v-permission="'orderManagement/refund'"
          :disabled="
            orderData.type == 1 ||
            orderData.packageRels?.every(
              v => v.surplusPrice !== null && v.surplusPrice <= 0
            ) ||
            orderData.packageRels?.every(v => v.paymentType != 1) ||
            orderData.packageRels?.every(
              v => !~v.paymentMethod?.indexOf('@')
            ) ||
            (orderData.packageStatus == 8 && orderData.lplApplyStatus == 2) ||
            (orderData.packageStatus == -4 && orderData.lplApplyStatus == 2)
          "
        >
          退款
        </el-button>

        <!--
          包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、
          7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功
         -->
        <el-button
          type="primary"
          v-if="!canChangeDisabled || orderData.packageStatus == 0"
          @click="submitFn"
        >
          保 存
        </el-button>
      </div>
    </div>
    <ChangeOrderTips
      v-if="showTips"
      :showTips="showTips"
      @closeTips="closeTipsFn"
      @sureTips="sureTips"
    />
    <!-- 添加商品 -->
    <AddGoods
      v-if="show"
      :isGift="true"
      @setData="check"
      :excludeSkuIds="excludeSkuIds"
      :multiple="addGoodsMultiple"
    />
    <!-- 定制品 -->
    <CustomInfo
      :dialogVisible="dialogVisible"
      v-if="customInfoData"
      width="40%"
      dialogTitle="定制信息"
      :needFormOptions="false"
      :data="customInfoData"
    />
    <!-- 移入搁置 -->
    <ToShelve
      :orderData="orderData"
      v-if="toShelveShow"
      @toShelveBack="toShelveBack"
    />
    <!-- 变更支付状态 -->
    <ChangePayment
      v-if="changePaymentShow"
      :orderData="orderData"
      @changePaymentBack="changePaymentBack"
    />
    <!-- 打印面单弹框 -->
    <PrintInfo
      v-if="printInfoShow"
      :printInfoData="printInfoData"
      :orderData="orderData"
      :isChangeLogist="isChangeLogist"
      @printInfoBack="printInfoBack"
    />
    <!-- 解除匹配关系 -->
    <Dissolution
      v-if="dissolutionShow"
      :packageStatus="orderData.packageStatus"
      :packageSkuId="packageSkuId"
      :packageSkuIdSku="packageSkuIdSku"
      @dissolutionBack="dissolutionBack"
    />
    <!-- 补打单 -->
    <ReissuePrinted
      v-if="reissuePrintedShow"
      :data="{ packageIds: orderData.packageId, fromSourth: true }"
      :dialogVisible="true"
      :dialogTitle="'请选择补打原因'"
      @emitBack="printBack"
    />
    <RefundDialog
      v-if="refundDialogShow"
      :sourth="true"
      :data="{ selectInfo: [orderData] }"
    />
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
  onBeforeUnmount,
  computed,
  onMounted,
  onActivated,
  onDeactivated,
  nextTick,
  provide
} from 'vue'
import Logistics from '@/views/order/orderManagement/components/orderDialog/shipping.vue'
import MatchOrder from '@/views/order/orderManagement/components/orderDialog/matchOrder.vue' //合并订单
import CustomInfo from '@/views/order/orderManagement/components/orderDialog/customInfo.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deepCopy, patternFn, skuShow } from '@/utils/tool.js'
import { authPath } from '@/utils/hooks'
import { orderDetailHooks } from '@/views/order/orderManagement/util/orderHooks.js'
import {
  packageOrderDetails,
  getCountries,
  savePackageDetails,
  savePackageRemark,
  getRemarkNames,
  deletePackageRemark,
  updatePackageGoodsBatch
} from '@/api/order/orderDetail.js'
import { checkUserLogs } from '@/api/logs.js'
import ChangeOrderTips from './components/orderDetail/changeOrderTips.vue'
import AddGoods from '@/views/order/orderManagement/reissueGifts/components/addGoods.vue'
import ToShelve from '@/views/order/orderManagement/orderDetail/components/dialog/toShelve.vue'
import ChangePayment from '@/views/order/orderManagement/orderDetail/components/dialog/changePayment.vue'
import PrintInfo from '@/views/order/orderManagement/orderDetail/components/dialog/printInfo.vue'
import Dissolution from '@/views/order/orderManagement/orderDetail/components/dialog/dissolution.vue'
import SingleItem from '@/views/order/orderManagement/orderDetail/components/singleItem.vue'
import ReissuePrinted from '@/views/order/orderManagement/components/orderDialog/reissuePrinted.vue'
import RefundDialog from '@/views/order/orderManagement/components/refund.vue'
import { checkData } from '@/views/order/orderManagement/orderDetail/composables/tool'
export default {
  name: 'OrderDetail',
  components: {
    MatchOrder,
    Logistics,
    ChangeOrderTips,
    AddGoods,
    CustomInfo,
    ToShelve,
    ChangePayment,
    PrintInfo,
    Dissolution,
    SingleItem,
    ReissuePrinted,
    RefundDialog
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    let scrollTop = 0
    onActivated(() => {
      window.addEventListener('scroll', handleScroll)
      nextTick(() => {
        document.documentElement.scrollTop = scrollTop
      })
    })
    onDeactivated(() => {
      window.removeEventListener('scroll', handleScroll, false)
      scrollTop = document.documentElement.scrollTop
    })
    let store = useStore()
    let userInfo = computed(() => store.state.user.userInfo)
    let userId = userInfo.value.userId
    const { proxy } = getCurrentInstance()
    const route = useRoute() //获取route
    const router = useRouter()
    let packageId = route.query.packageId || props.data.packageId || '' //从route中获取路由传参的包裹id
    const isAll = route.query.isAll == 1 ? false : true
    const isChangeLogist = route.query.isChangeLogist
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const state = reactive({
      isChangeAll: 0,
      reissuePrintedShow: false,
      refundDialogShow: false,
      changeNumber: 0,
      isAllMatching: true,
      matchingStatus: 1,
      changeCombineType: 1, //选择更换商品是：1单品，2组合品
      addGoodsMultiple: true,
      prevPackageId: '',
      nextPackageId: '',
      packageSkuId: null,
      packageSkuIdSku: null,
      dissolutionShow: false,
      printInfoShow: false,
      printInfoData: null,
      changePaymentShow: false,
      toShelveShow: false,
      dialogVisible: false, //定制信息显示
      customInfoData: null, //定制信息数据
      show: false,
      excludeSkuIds: [], //选择商品需要排除的skuid
      changeGoodsId: false,
      changeSkuId: false,
      defaultValue: [], //默认选择的物流数据
      userId, //用户id
      shippingForm: {
        //物流信息弹框数据
        logisticsId: '', //包裹物流主键
        id: packageId, //包裹号
        infos: {
          logisticsId: '', //物流信息主键ID
          packageId //包裹号
        },
        type: 0 //是否是其他
      },
      matchData: {
        query: {
          sku: '',
          customization: ''
        }
      },
      returnStatus: true, //是否返回
      matchOrderShow: false, //匹配展示
      delRemarkShow: false,
      remarkTypeList: [], //订单备注类型
      changeRenarkId: '',
      remarkType: '',
      remarkText: '', ////订单备注弹框内容
      closeModal: false,
      remarkShow: false, //订单备注弹框是否显示
      packageId, //包裹id
      canChangeDisabled: true,
      activities: authPath('orderManagement/refundedInfo')
        ? [
            { title: '客户信息', id: 'customInfo', offsetTop: 0 },
            { title: '报关信息', id: 'VOs', offsetTop: 0 },
            { title: '订单商品', id: 'orderDetail', offsetTop: 0 },
            { title: '订单信息', id: 'orderInfo', offsetTop: 0 },
            { title: '物流信息', id: 'shipping', offsetTop: 0 },
            { title: '财务信息', id: 'finance', offsetTop: 0 },
            { title: '退款信息', id: 'returnBack', offsetTop: 0 },
            { title: '备注信息', id: 'remarks', offsetTop: 0 },
            { title: '操作日志', id: 'logs', offsetTop: 0 }
          ]
        : [
            { title: '客户信息', id: 'customInfo', offsetTop: 0 },
            { title: '报关信息', id: 'VOs', offsetTop: 0 },
            { title: '订单商品', id: 'orderDetail', offsetTop: 0 },
            { title: '订单信息', id: 'orderInfo', offsetTop: 0 },
            { title: '物流信息', id: 'shipping', offsetTop: 0 },
            { title: '财务信息', id: 'finance', offsetTop: 0 },
            { title: '备注信息', id: 'remarks', offsetTop: 0 },
            { title: '操作日志', id: 'logs', offsetTop: 0 }
          ], //右侧栏内容
      activeStatus: 0, // 当前右侧栏内容，与右侧栏内容下标相同，方便计算
      customInfo: {
        //财务信息一期不做
        rules: {
          firstName: [
            { required: true, message: '', trigger: 'blur' },
            { min: 2, max: 50, message: '', trigger: 'blur' }
          ],
          lastName: [
            { required: true, message: '', trigger: 'blur' },
            { min: 2, max: 50, message: '', trigger: 'blur' }
          ]
        },
        ruleForm: {
          name: ''
        }
      },
      options: [
        {
          value: '1',
          label: '万众智谷仓库'
        }
      ],
      value: '1',
      moneyType: '1',
      orderData: { packageLogistics: {}, countryList: [] }, //接口返回的订单详情数据
      orderStatus: [
        {
          id: 0,
          title: '待审核'
        },
        {
          id: 1,
          title: '待处理'
        },
        {
          id: 2,
          title: '申请中'
        },
        {
          id: 3,
          title: '申请失败'
        },
        {
          id: 4,
          title: '申请成功'
        },
        {
          id: 5,
          title: '待打单有货'
        },
        {
          id: 6,
          title: '待打单缺货'
        },
        {
          id: 7,
          title: '待发货'
        },
        {
          id: 8,
          title: '已发货'
        },
        {
          id: 9,
          title: '未付款'
        },
        {
          id: 10,
          title: '已退款'
        },
        {
          id: -1,
          title: '更换物流待处理'
        },
        {
          id: -2,
          title: '更换待打单'
        },
        {
          id: -3,
          title: '更换待发货'
        },
        {
          id: -4,
          title: '更换交运成功'
          // title:'已发货'
        }
      ],
      orderStatusText: '', //当前订单状态
      attr: [
        {
          name: '含电',
          checked: false,
          childrenChecked: '内电',
          children: [
            {
              name: '内电'
            },
            {
              name: '纯电'
            }
          ]
        },
        {
          name: '含非液体化妆品',
          checked: false
        },
        {
          name: '特货（敏感货）',
          checked: false
        }
      ],
      emptyData: '', //暂时无数据的字段
      disabledInput: true, //禁用输入框
      checkLogs: {
        //查询用户日志数据
        page: {
          pageNo: 1,
          pageSize: 10
        },
        userId: '',
        userName: '',
        start: '',
        end: '',
        postName: '',
        deptName: '',
        userId: '',
        packageId: packageId,
        logType: 1
      },
      logsData: {
        dataList: [],
        totalCount: 0
      },
      paginationArr: [10, 20, 30, 40, 100], //分页每页选择条数默认数据
      nameLength: 60, //姓名最大长度
      cityLength: 200, //城市名最大长度
      addressLength: 300, //地址最大长度
      shuiLength: 30, //税号最大长度
      postLength: 40, //邮编最大长度
      declareLength: 80, //报关最大长度
      countryList: [], //国家列表
      rules: {
        //输入框校验
				lastName: [{ required: true, message: '请输入客户姓', trigger: 'blur' }],
				firstName: [{ required: true, message: '请输入客户名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        countryEn: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        postcode: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
        street1: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      ruleForm: {
				lastName:'',
				firstName:'',
        name: '',
        countryEn: '',
        phone: '',
        postcode: '',
        street1: ''
      },
      orderInfo: [], //订单信息,切换币种用
      shippingModal: false, //物流信息弹框
      clickStatus: true,
      shippingModalData: '',
      shippingName: '',
      showTips: false
    })

    // 报关信息总价格
    let VOsPrice = computed(() => {
      let totalPrice = 0
      if (state.orderData?.packageGoodsDetailsVOs)
        state.orderData?.packageGoodsDetailsVOs.forEach(
          v => (totalPrice += v.customsAmount * v.goodsQuantity)
        )
      return totalPrice.toFixed(2)
    })
    // 报关信息总质量
    let VOsWeight = computed(() => {
      let totalWeight = 0
      if (state.orderData?.packageGoodsDetailsVOs)
        state.orderData?.packageGoodsDetailsVOs.forEach(
          v => (totalWeight += v.customsWeight * v.goodsQuantity)
        )
      return totalWeight.toFixed(2)
    })
    function customInfoFn(data) {
      state.customInfoData = data
      state.dialogVisible = true
    }

    getPackageIdList()
    function getPackageIdList() {
      const packageIdList = sessionStorage.getItem('packageIdList')
        ? JSON.parse(sessionStorage.getItem('packageIdList'))
        : []
      packageIdList.forEach((v, i) => {
        if (v == state.packageId) {
          if (i == 0) {
            state.prevPackageId = ''
            state.nextPackageId =
              packageIdList.length > 1 ? packageIdList[1] : 0
          } else if (i == packageIdList.length - 1) {
            state.prevPackageId =
              packageIdList.length > 1 ? packageIdList[i - 1] : 0
            state.nextPackageId = ''
          } else {
            state.prevPackageId = packageIdList[i - 1]
            state.nextPackageId = packageIdList[i + 1]
          }
        }
      })
    }
    function goToPage(id) {
      state.packageId = id
      packageOrderDetailsFn()
      state.checkLogs.packageId = id
      state.shippingForm.id = id
      state.shippingForm.infos.packageId = id
      getOperationLogFn()
      getPackageIdList()
      // const query = deepCopy(route.query)
      // query.packageId = id
      // router.replace({
      //   query
      // })
      // refreshRouter()
    }
    function refreshRouter() {
      const name = route.name
      const index = store.getters.cachedViews.findIndex(view => view === name)
      store.commit('com/deleteCachedView', { index, name })
      store.dispatch('com/setRefreshByActions', false)
      nextTick(() => {
        store.dispatch('com/setRefreshByActions', true)
        if (name === 'OrderManagement') {
          store.dispatch('orderManage/setOrderStatusByActions', '1')
        } // 订单当前页才清除订单tab
        store.commit('com/addCachedView', { index, name })
      })
    }
    window.addEventListener('keydown', e => {
      if (e.key == 'PageUp' && state.prevPackageId) {
        goToPage(state.prevPackageId)
      } else if (e.key == 'PageDown' && state.nextPackageId) {
        goToPage(state.nextPackageId)
      }
    })

    function inputBlur(val) {
      state.orderData.packageRels.forEach(v => {
        v.packageSkus.forEach(val => {
          val.packageGoods.forEach(ele => {
            if (!ele.goodsQuantity) ele.goodsQuantity = 1
          })
        })
      })
    }
    //选择商品回参
    function check(data) {
      state.addGoodsMultiple = true
      state.show = !state.show
      if (data) {
        let tempList = []
        let attr = [
          {
            checked: false,
            childrenChecked: '内电',
            name: '含电',
            children: [
              {
                name: '内电'
              },
              {
                name: '纯电'
              }
            ]
          },
          {
            checked: false,
            name: '含非液体化妆品'
          },
          {
            checked: false,
            name: '特货（敏感货）'
          }
        ]
        let newData = []
        newData = data.map(v => {
          v.mainImg = v.mainImgUrl
          v.giftFlag = v.isGift || false
          if (v.customsAttribute) {
            v.attrCheckedList = []
            let customsAttribute = v.customsAttribute.split(',') || []
            customsAttribute.forEach(item => {
              if (item.indexOf('内电') != -1) {
                attr[0].checked = true
                attr[0].childrenChecked = '内电'
                v.attrCheckedList.push(attr[0].name)
              } else if (item.indexOf('纯电') != -1) {
                attr[0].checked = true
                attr[0].childrenChecked = '纯电'
                v.attrCheckedList.push(attr[0].name)
              } else if (item.indexOf('液体') != -1) {
                attr[1].checked = true
                v.attrCheckedList.push(attr[1].name)
              } else if (item.indexOf('敏感') != -1) {
                attr[2].checked = true
                v.attrCheckedList.push(attr[2].name)
              }
            })
          }
          if (v.combineType == 2) {
            v.childGoodsBases.forEach(ele => {
              tempList.push({
                attr,
                attrCheckedList: ele.attrCheckedList || [],
                customsAmount: ele.customsAmount,
                goodsPrice: ele.declareAmount,
                customsAttribute: ele.customsAttribute,
                customsCode: ele.customsCode,
                customsInfoCn: ele.customsInfoCn,
                customsInfoEn: ele.customsInfoEn,
                customsMatetial: ele.customsMatetial,
                customsPurpose: ele.customsPurpose,
                customsWeight: ele.customsWeight,
                goodsSku: ele.goodsSku,
                id: ele.id,
                skuId: ele.skuId,
                mainImg: ele.mainImgUrl,
                customsMatetial: ele.customsMatetial,
                skuCode: ele.skuCode,
                proposalPrice: ele.proposalPrice
              })
            })
          } else {
            tempList.push({
              attr,
              attrCheckedList: v.attrCheckedList || [],
              customsAmount: v.customsAmount,
              goodsPrice: v.declareAmount,
              customsAttribute: v.customsAttribute,
              customsCode: v.customsCode,
              customsInfoCn: v.customsInfoCn,
              customsInfoEn: v.customsInfoEn,
              customsMatetial: v.customsMatetial,
              customsPurpose: v.customsPurpose,
              customsWeight: v.customsWeight,
              goodsSku: v.goodsSku,
              id: v.id,
              skuId: v.skuId,
              mainImg: v.mainImgUrl,
              customsMatetial: v.customsMatetial,
              skuCode: v.skuCode,
              proposalPrice: v.proposalPrice
            })
          }
          return v
        })
        let packageSkuId = null
        if (state.changeGoodsId || state.changeSkuId) {
          // 更换商品
          newData.forEach(ele => {
            ele.operation = 2
            ele.goodsPrice = ele.declareAmount
            ele.proposalPrice = ele.proposalPrice
            ele.goodsQuantity = state.changeNumber || 1
            ele.quantity = state.changeNumber || 1
          })
          state.orderData.packageRels.forEach(v => {
            v.packageSkus.forEach(item => {
              if (state.changeCombineType == 2) {
                // 组合品
                if (
                  item.packageSkuMatch &&
                  item.packageSkuMatch.skuId == state.changeSkuId &&
                  item.packageSkuMatch.id == state.changeGoodsId
                ) {
                  packageSkuId = item.packageSkuId
                  newData = newData.map(eles => {
                    eles.currentFlag =
                      item.packageSkuMatch.currentFlag ||
                      item.packageGoods[0]?.currentFlag
                    return eles
                  })
                  item.packageSkuMatch.operation = 3
                  item.packageGoods.forEach(ele => {
                    if (!ele.combineType) {
                      ele.operation = 3
                      state.orderData.packageGoodsDetailsVOs =
                        state.orderData.packageGoodsDetailsVOs.filter(
                          val => val.id != ele.id
                        )
                    }
                  })
                  item.packageGoods = [
                    ...item.packageGoods.filter(
                      value =>
                        (value.combineType &&
                          value.skuId != state.changeSkuId) ||
                        !value.combineType
                    ),
                    ...newData
                  ]
                }
              } else {
                // 单品
                item.packageGoods.forEach(ele => {
                  if (
                    state.changeGoodsId &&
                    ele.id == state.changeGoodsId &&
                    state.changeSkuId &&
                    ele.skuId == state.changeSkuId &&
                    ele.operation != 3
                  ) {
                    packageSkuId = item.packageSkuId
                    newData = newData.map(eles => {
                      eles.currentFlag = ele.currentFlag
                      return eles
                    })
                    ele.operation = 3
                    state.orderData.packageGoodsDetailsVOs =
                      state.orderData.packageGoodsDetailsVOs.filter(
                        val => val.id != ele.id
                      )
                    item.packageGoods = [
                      ...item.packageGoods.filter(
                        value =>
                          (value.combineType &&
                            value.skuId != state.changeSkuId) ||
                          !value.combineType
                      ),
                      ...newData
                    ]
                  }
                })
              }
            })
          })
          state.changeCombineType = 1
          state.changeGoodsId = false
          state.changeSkuId = false
          if (state.isChangeAll == 2) {
            // isChangeAll 是否修改全部包裹 1 更换当前包裹 2 更换所有包裹
            // 批量变更发货商品
            let goodsUpdate = data[0]
            goodsUpdate.packageSkuId = packageSkuId
            goodsUpdate.giftFlag = goodsUpdate.giftFlag ? 1 : 0
            updatePackageGoodsBatch(goodsUpdate).then(res => {
              if (res.code == 200) {
                packageOrderDetailsFn()
                ElMessage.success({ message: res.message })
              } else {
                ElMessage.warning({ message: res.message })
              }
            }).catch(res=>{
							packageOrderDetailsFn()
						})
            return false
          }
        } else {
          // 新增商品
          newData.forEach(ele => {
            ele.operation = 1
            ele.goodsPrice = ele.declareAmount
            ele.proposalPrice = ele.proposalPrice
            state.orderData.packageRels[0].packageSkus[
              state.orderData.packageRels[0].packageSkus.length - 1
            ].packageGoods.push(ele)
          })
        }
        state.orderData.packageGoodsDetailsVOs = [
          ...state.orderData.packageGoodsDetailsVOs,
          ...tempList
        ]
        submitFnBody(true)
      }
    }
    function setGift(id, skuId, combineType) {
			if (!checkData(state.orderData)) return false
      state.orderData.packageRels.forEach(v => {
        v.packageSkus.forEach(item => {
          if (
            combineType == 2 &&
            item.packageSkuMatch?.skuId == skuId &&
            id == item.packageSkuMatch?.id
          ) {
            if (item.packageSkuMatch.giftFlag) {
              item.packageSkuMatch.giftFlag = 0
							item.packageSkuMatch.operation = 2
            } else {
              item.packageSkuMatch.giftFlag = 1
							item.packageSkuMatch.operation = 2
            }
            item.packageGoods.forEach(ele => {
              if (!ele.combineType) {
                if (ele.giftFlag) {
                  ele.giftFlag = 0
									ele.operation = 2
                } else {
                  ele.giftFlag = 1
									ele.operation = 2
                }
              }
            })
          } else {
            item.packageGoods.forEach(ele => {
              if (id == ele.id && ele.skuId == skuId) {
                if (ele.giftFlag) {
                  ele.giftFlag = 0
									ele.operation = 2
                } else {
                  ele.giftFlag = 1
									ele.operation = 2
                }
              }
            })
          }
        })
      })
      submitFnBody(true)
    }
    // 删除选择的商品
    function delChooseGoods(id, skuId, combineType) {
			if (!checkData(state.orderData)) return false
      let goodsLength = 0,
        leftItemIs0 = false
      state.orderData.packageRels.forEach(val => {
        val.packageSkus.forEach(item => {
          leftItemIs0 = true
          // 组合品
          if (item.packageSkuMatch) {
            goodsLength++
            item.packageGoods.forEach(v => {
              if (v.operation != 3 && v.combineType) goodsLength++
            })
          } else {
            item.packageGoods.forEach(v => {
              if (v.operation != 3) goodsLength++
            })
          }
        })
      })
      if (
        goodsLength < 2 &&
        state.orderData.packageStatus != 0 &&
        !leftItemIs0
      ) {
        return ElMessage.warning({
          message: '发货商品至少要有一个'
        })
      } else {
        ElMessageBox.confirm('确认删除商品？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            state.orderData.packageRels.forEach(v => {
              v.packageSkus.forEach(item => {
                if (combineType == 2) {
                  if (
                    item.packageSkuMatch?.id == id &&
                    item.packageSkuMatch.skuId == skuId
                  ) {
                    item.packageSkuMatch.operation = 3
                    item.packageGoods.forEach(ele => {
                      if (!ele.combineType) {
                        ele.operation = 3
                        state.orderData.packageGoodsDetailsVOs =
                          state.orderData.packageGoodsDetailsVOs.filter(
                            val => val.id != ele.id
                          )
                      } else if (skuId && ele.skuId == skuId) {
                        ele.operation = 3
                        state.orderData.packageGoodsDetailsVOs =
                          state.orderData.packageGoodsDetailsVOs.filter(
                            val => val.skuId != ele.skuId
                          )
                      }
                    })
                  } else {
                    item.packageGoods.forEach(ele => {
                      if (ele.id == id && ele.skuId == skuId) {
                        ele.operation = 3
                        state.orderData.packageGoodsDetailsVOs =
                          state.orderData.packageGoodsDetailsVOs.filter(
                            val => val.skuId != ele.skuId
                          )
                      }
                    })
                  }
                } else {
                  item.packageGoods.forEach(ele => {
                    if (ele.id == id && ele.skuId == skuId) {
                      ele.operation = 3
                      state.orderData.packageGoodsDetailsVOs =
                        state.orderData.packageGoodsDetailsVOs.filter(
                          val => val.skuId != ele.skuId && val.id != ele.id
                        )
                    }
                  })
                }
              })
            })
            submitFnBody(true)
          })
          .catch(() => {})
      }
    }
    // 点更换或者选择商品
    function chooseFn(data, skuId, combineType, num, changeAll) {
			if (!checkData(state.orderData)) return false
      // changeAll 是否修改全部包裹 1 更换当前包裹 2 更换所有包裹
      state.isChangeAll = changeAll || 0
      state.changeNumber = num
      // state.addGoodsMultiple = combineType ? false : true
      state.addGoodsMultiple = false
      state.changeCombineType = combineType
      state.excludeSkuIds = []
      state.orderData.packageRels.forEach(v => {
        v.packageSkus.forEach(item => {
          if (item.packageSkuMatch && item.packageSkuMatch.operation != 3)
            state.excludeSkuIds.push(item.packageSkuMatch.skuId)
          item.packageGoods.forEach(ele => {
            if (ele.operation != 3) {
              if (ele.skuId) {
                state.excludeSkuIds.push(ele.skuId)
              } else [state.excludeSkuIds.push(ele.id + '')]
            }
          })
        })
      })
      state.show = !state.show
      state.changeGoodsId = data
      state.changeSkuId = skuId
    }
    //切换币种
    function orderPriceChange(type) {
      state.orderInfo = []
      if (type == '1') {
        // 原始货币
        if (!state.orderData.packageRels) return
        state.orderData.packageRels.forEach(v => {
          let { totalPrice, currency, totalItemPrice, taxPrice, refundPrice } =
            v

          state.orderInfo.push({
            totalPrice,
            currency,
            totalItemPrice,
            taxPrice,
            refundPrice: state.orderData.mergeFlag == -1 ? '0.00' : refundPrice
          })
        })
      } else {
        // 2 人民币
        if (!state.orderData.packageRels) return
        state.orderData.packageRels.forEach(v => {
          let obj = {}
          if (v.totalPrice > 0) {
            obj.totalPrice = ((v.totalPrice - 0) * v.currencyCnyRate).toFixed(2) //订单金额
          } else {
            obj.totalPrice = v.totalPrice
          }
          if (v.refundPrice > 0) {
            obj.refundPrice =
              state.orderData.mergeFlag == -1
                ? '0.00'
                : ((v.refundPrice - 0) * v.payCurrencyRate).toFixed(2) //订单退款金额
          } else {
            obj.refundPrice =
              state.orderData.mergeFlag == -1 ? '0.00' : v.refundPrice
          }
          obj.currency = 'CNY' //货币
          if (v.totalItemPrice > 0) {
            obj.totalItemPrice = (
              (v.totalItemPrice - 0) *
              v.currencyCnyRate
            ).toFixed(2) //商品总额：
          } else {
            obj.totalItemPrice = v.totalItemPrice
          }
          if (v.taxPrice > 0) {
            obj.taxPrice = ((v.taxPrice - 0) * v.currencyCnyRate).toFixed(2) //税收金额：
          } else {
            obj.taxPrice = v.taxPrice
          }
          state.orderInfo.push(obj)
        })
      }
    }

    //获取订单详情
    function packageOrderDetailsFn() {
      packageOrderDetails({ packageId: state.packageId }).then(res => {
        if (res.code == 200) {
          state.shippingModal = false
          //储存订单数据
          if (res.data.packageRels) {
            res.data.packageRels.forEach(v => {
              if (v.type == 1) {
                v.typeName = '手工订单'
              } else if (v.type == 0) {
                v.typeName = '用户下单'
              } else if (v.type == 3) {
                v.typeName = '补发赠品'
              } else if (v.type == 2) {
                v.typeName = '补发包裹'
              } else {
                v.typeName = ''
              }
            })
          }
          state.defaultValue = []
          if (res.data.packageLogistics) {
            if (res.data.packageLogistics.logistics) {
              state.defaultValue.push(res.data.packageLogistics.logistics)
              if (res.data.packageLogistics.lgtcLine) {
                state.defaultValue.push(res.data.packageLogistics.lgtcLine)
              }
            }
            if (res.data.packageLogistics.logisticsName) {
              state.shippingName = res.data.packageLogistics.logisticsName
              if (res.data.packageLogistics.lgtcLineName) {
                state.shippingName =
                  state.shippingName +
                  ' / ' +
                  res.data.packageLogistics.lgtcLineName
              }
            }
            // 运单类型（来源） 0系统生成 1手动输入
            if (res.data.packageLogistics.trackType === 0) {
              res.data.packageLogistics.trackTypeText = '系统生成'
            } else if (res.data.packageLogistics.trackType === 1) {
              res.data.packageLogistics.trackTypeText = '手动输入'
            } else {
              res.data.packageLogistics.trackTypeText = ''
            }
            // 申请状态 1成功 0失败
            if (res.data.packageLogistics.applyStatus === 0) {
              res.data.packageLogistics.applyStatusText = '失败'
            } else if (res.data.packageLogistics.applyStatus === 1) {
              res.data.packageLogistics.applyStatusText = '成功'
            } else {
              res.data.packageLogistics.applyStatusText = ''
            }
          } else {
            // 无数据增加空数据，否则抛错
            res.data.packageLogistics = {
              trackNumber: '',
              applyStatusText: '',
              trackTypeText: '',
              generateTime: '',
              printTime: '',
              deliveryTime: '',
              deliveryWeight: '',
              signTime: '',
              originalUrl: '',
              logistics: ''
            }
          }
          state.orderData = deepCopy(res.data)
          // 切换币种
          orderPriceChange(state.moneyType)

          // 已搁置订单
          if (state.orderData.layFlag == 1) {
            state.canChangeDisabled = true
          } else {
            // 已禁止订单
            if (state.orderData.forbidFlag == 1) {
              state.canChangeDisabled = true
            } else {
              // 未付款订单和申请中订单
              if (
                state.orderData.packageStatus == 9 ||
                state.orderData.packageStatus == 2
              ) {
                state.canChangeDisabled = true
              } else {
                // 订单不可修改
                if (!state.orderData.showSubmit) {
                  state.canChangeDisabled = true
                } else {
                  // 二级页面，且来自于已交运成功订单
                  if (
                    isChangeLogist === 'true' &&
                    state.orderData.packageStatus == -4
                  ) {
                    state.canChangeDisabled = true
                  } else {
                    state.canChangeDisabled = false
                  }
                }
              }
            }
          }

          //未付款详情页面 去掉备注 orderData.packageStatus
          if (res.data.packageStatus == 9)
            state.activities = state.activities.filter(v => v.id != 'remarks')
          //订单状态转换
          state.orderStatusText = state.orderStatus.filter(
            v => v.id == res.data.packageStatus
          )[0].title
          // 报关信息==》报关属性
          state.orderData.packageGoodsDetailsVOs.forEach(v => {
            let { attr } = state
            attr = deepCopy(attr)
            if (v.customsAttribute) {
              v.attrCheckedList = []
              let customsAttribute = v.customsAttribute.split(',') || []
              customsAttribute.forEach(item => {
                if (item.indexOf('内电') != -1) {
                  attr[0].checked = true
                  attr[0].childrenChecked = '内电'
                  v.attrCheckedList.push(attr[0].name)
                } else if (item.indexOf('纯电') != -1) {
                  attr[0].checked = true
                  attr[0].childrenChecked = '纯电'
                  v.attrCheckedList.push(attr[0].name)
                } else if (item.indexOf('液体') != -1) {
                  attr[1].checked = true
                  v.attrCheckedList.push(attr[1].name)
                } else if (item.indexOf('敏感') != -1) {
                  attr[2].checked = true
                  v.attrCheckedList.push(attr[2].name)
                }
              })
              v.attr = attr
            } else {
              v.attrCheckedList = []
              v.attr = attr
            }
          })
          if (state.orderData.street2&&!state.orderData.street1) {
            state.rules.street1 = ''
          } else {
            state.rules.street1 = [
              { required: true, message: '请输入地址', trigger: 'blur' }
            ]
          }
          //获取国家列表country
          getCountries().then(res => {
            if (res.code == 200) {
              state.orderData.countryList = res.data
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    packageOrderDetailsFn()

    // //查询日志列表
    function getOperationLogFn() {
      checkUserLogs(state.checkLogs).then(res => {
        if (res.code == 200) {
          state.logsData.dataList = res.data.dataList
          state.logsData.totalCount = res.data.page.totalCount
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    getOperationLogFn()

    // 切换每页条数
    const changeUserListSize = val => {
      state.checkLogs.page.pageSize = val
      state.checkLogs.page.pageNo = 1
      getOperationLogFn()
    }

    // 切换页码
    const changeUserListCurrent = val => {
      state.checkLogs.page.pageNo = val
      getOperationLogFn()
    }

    // 第一阶段不做
    const handleChange = value => {
      // console.log(value)
    }

    // var customInfoList = ref(null)

    //点击右侧--》锚点定位
    let statusFlag = true
    const clickFn = (id, index) => {
      statusFlag = false
      setTimeout(() => {
        statusFlag = true
      }, 500)
      state.activeStatus = index
      document
        .getElementById(id)
        .scrollIntoView({ block: 'center', inline: 'nearest' })
    }
    onMounted(() => {
      // 在更新前前执行
      clickFn('customInfo', 0)
    })
    // setTimeout(()=>{},500)

    // 获取各个模块的offsetTop
    function getDomOffsetTop(scrollTop) {
      state.activities.forEach((v, i) => {
        v.offsetTop = document.querySelector('#' + v.id).offsetTop
        if (v.offsetTop < scrollTop + 200) state.activeStatus = i
      })
    }

    // 监听滚动条变化
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (statusFlag) {
        getDomOffsetTop(scrollTop)
      }
    }
    // 监听页面滚动事件（注：此方法较为消耗性能，可以后期优化）
    window.addEventListener('scroll', handleScroll)

    //页面取消route
    function backPrevFn() {
      router.push({
        name: 'OrderManagement'
      })
    }
    const cancelFn = () => {
      if (isAll) {
        packageOrderDetailsFn()
      } else {
        backPrevFn()
      }
    }


		// 数量变化
		function nunmberChange(row){
			if(!row.operation) row.operation = 2
			submitFnBody(true)
		}
    //提交修改
    function submitFnBody(flag) {
      if (!checkData(state.orderData)) return false
      let savePackageDetailsParam = {
        packageReceiveInfo: {
          packageId: state.orderData.packageId, //包裹号
          packageAddressId: state.orderData.addressId, //包裹地址id
          phone: state.orderData.phone, //联系电话
          company: state.orderData.company, //公司
          taxNum: state.orderData.taxNum, //税号
          email: state.orderData.email, //邮箱
          countryEn: state.orderData.countryEn, //国家英文名称
          firstName: state.orderData.firstName, //性
          lastName: state.orderData.lastName, //名
          countryCn: state.orderData.countryList.filter(
            v => v.countryEnName == state.orderData.countryEn
          )[0]
            ? state.orderData.countryList.filter(
                v => v.countryEnName == state.orderData.countryEn
              )[0].countryName
            : '', //国家中文名称
          postcode: state.orderData.postcode, //邮编
          state: state.orderData.state, //州省
          city: state.orderData.city, //城市
          street1: state.orderData.street1, //地址1
          street2: state.orderData.street2 //地址1
        },
        goodsCustomInfos: [], //报关信息
        goodsUpdates: null //一期不做(对仓库商品操作)
      }
      let canSubmit = 0 //主要校验价格和重量
      state.orderData.packageGoodsDetailsVOs.forEach(v => {
        if (
          !patternFn(v.customsWeight - 0, 'weght') ||
          v.customsWeight - 0 > 999999.99
        )
          canSubmit = 1
        if (
          !patternFn(v.customsAmount - 0, 'weght') ||
          v.customsAmount - 0 > 999999.99
        )
          canSubmit = 2
        let obj = {
          packageId: state.orderData.packageId, //包裹号
          packageGoodsId: v.id, //包裹商品id
          goodsId: '', //	商品id
          mainImg: v.mainImg, //商品主图
          goodsSku: v.goodsSku, //商品sku
          customsInfoCn: v.customsInfoCn, //中文报关名
          customsInfoEn: v.customsInfoEn, //英文报关名
          customsWeight: v.customsWeight, //重量
          customsAmount: v.customsAmount, //价格
          customsMatetial: v.customsMatetial, //材质
          customsPurpose: v.customsPurpose, //用途
          customsCode: v.customsCode, //海关编码
          customsAttribute: '', //报关属性
          permanent: 0, //永久生效 0否1是,没有就传0
          isMatch: v.isMatch
        }
        if (v.attrCheckedList.length) {
          if (v.attr[0].childrenChecked) {
            v.attrCheckedList.map((item, index) => {
              if (item == '含电') {
                v.attrCheckedList[index] = item + v.attr[0].childrenChecked
              }
            })
          }
          obj.customsAttribute = v.attrCheckedList.join(',')
        } else {
          obj.customsAttribute = ''
        }
        savePackageDetailsParam.goodsCustomInfos.push(obj)
      })
      if (canSubmit == 1) {
        return ElMessage.warning({
          message: '报关重量请输入正数，小数点保留两位，最大999999.99'
        })
      } else if (canSubmit == 2) {
        return ElMessage.warning({
          message: '报关价格请输入正数，小数点保留两位，最大999999.99'
        })
      }
      let goodsUpdates = []
      state.orderData.packageRels.forEach(v => {
        v.packageSkus.forEach(item => {
          item.packageGoods.forEach(ele => {
            if (!(ele.operation == 3 && ele.combineType)) {
              let obj = {
                exportId: ele.exportId || null,
                id: ele.id || null,
                operation: ele.operation ?? item.operation ?? null,
                skuId: ele.skuId || null,
                goodsQuantity:
                  ele.ratio && item.packageSkuMatch
                    ? item.packageSkuMatch.quantity
                    : ele.goodsQuantity || ele.goodsNumber || null,
                giftFlag: ele.giftFlag ? 1 : 0,
                warehouseId: ele.warehouseId || 1,
                goodsName: ele.goodsName || null,
                goodsSku: ele.goodsSku || null,
								goodsId:ele.goodsId,
                mainImg: ele.mainImg || null,
                declareAmount: ele.declareAmount || null,
                skuValue: ele.skuValue || null,
                customValue: ele.customValue || null,
                skuType: ele.skuType || null,
                descriptionEn: ele.descriptionEn || null,
                customsInfoCn: ele.customsInfoCn || null,
                customsInfoEn: ele.customsInfoEn || null,
                customsAmount: ele.customsAmount || null,
                customsWeight: ele.customsWeight || null,
                customsCode: ele.customsCode || null,
                customsMatetial: ele.customsMatetial || null,
                customsPurpose: ele.customsPurpose || null,
                customsAttribute: ele.customsAttribute || null,
                mainImgUrl: ele.mainImgUrl || null,
                price: ele.proposalPrice || null,
                packageSkuId:
                  ele.combineType && ele.operation != 2
                    ? null
                    : item.packageSkuId || null,
                skuCode: ele.skuCode || null,
                combineType: ele.combineType || null,
                currentFlag: ele.currentFlag,
                logisticsFee: ele.logisticsFee
              }
              goodsUpdates.push(obj)
            }
          })
        })
      })
      // 待审核时不校验发货商品
      // if (!packageGoodsLength && state.orderData.packageStatus != 0)
      //   return ElMessage.warning({
      //     message: '发货商品至少要有一个'
      //   })
      savePackageDetailsParam.goodsUpdates = goodsUpdates
      savePackageDetails(savePackageDetailsParam).then(res => {
        if (res.code == 200) {
          ElMessage.success({ message: res.message })
          if (isAll || state.orderData.packageStatus == 3 || flag) {
            packageOrderDetailsFn()
          } else {
            backPrevFn()
          }
        } else {
					packageOrderDetailsFn()
          ElMessage.warning({ message: res.message })
        }
      }).catch(res=>{
				packageOrderDetailsFn()
			})
    }
    const submitFn = () => {
      if (
        state.orderData.packageStatus == 8 ||
        state.orderData.packageStatus == -1 ||
        state.orderData.packageStatus == -2 ||
        state.orderData.packageStatus == -3 ||
        state.orderData.packageStatus == -4
      )
        return (state.showTips = true)
      submitFnBody()
    }

    //弹框关闭
    function closeTipsFn(data) {
      state.showTips = data
    }

    //弹框确认
    function sureTips(data) {
      if (data) {
        state.showTips = false
        submitFnBody()
      }
    }

    //切换币种
    const changeRadio = () => {
      orderPriceChange(state.moneyType)
    }

    //关闭弹框
    const closeRemarkFn = () => {
      state.remarkShow = false
    }

    //弹框确定
    const sureRemarkFn = () => {
      if (state.remarkType == '')
        return ElMessage.warning({ message: '请选择备注类型' })
      state.remarkShow = false
      let packageRemarkParam = {
        id: state.changeRenarkId,
        packageId,
        typeId: state.remarkType,
        content: state.remarkText
      }
      savePackageRemark(packageRemarkParam).then(res => {
        if (res.code == 200) {
          ElMessage.success({ message: res.message })
          res.data.createById = state.userId
          if (state.changeRenarkId) {
            // 编辑
            state.orderData.packageRemarks = [
              res.data,
              ...state.orderData.packageRemarks.filter(
                v => v.id != state.changeRenarkId
              )
            ]
          } else {
            // 新增
            state.orderData.packageRemarks.unshift(res.data)
          }
          state.checkLogs.page.pageNo = 1
          getOperationLogFn()
          state.changeRenarkId = ''
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    // 新增/修改 备注信息
    const addRemarkFn = (id, type) => {
      state.changeRenarkId = id //准备修改的备注id
      state.remarkType = type ? type - 0 : '' // 准备修改的备注类型
      state.remarkText = type
        ? state.orderData.packageRemarks.filter(v => v.id == id)[0].content
        : '' //
      state.remarkShow = true
    }

    //获取备注类型数据
    getRemarkNames({ useScope: '0' }).then(res => {
      if (res.code == 200) {
        state.remarkTypeList = res.data
        state.remarkType = res.data.length > 0 ? res.data[0].id : ''
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    //确定删除备注
    const sureDelRemarkFn = () => {
      deletePackageRemark({ id: state.changeRenarkId }).then(res => {
        if (res.code == 200) {
          state.orderData.packageRemarks = deepCopy(
            state.orderData.packageRemarks
          ).filter(v => v.id != state.changeRenarkId)
          state.changeRenarkId = ''
          state.delRemarkShow = false
          state.checkLogs.page.pageNo = 1
          getOperationLogFn()
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    //关闭删除
    const closeDelRemarkFn = () => {
      state.delRemarkShow = false
    }

    //删除备注信息
    const deleteFn = id => {
      state.changeRenarkId = id
      state.delRemarkShow = true
    }

    //匹配商品
    const matchShow = (sku, customization, status, key) => {
			if (!checkData(state.orderData)) return false
      state.matchingStatus = state.orderData.packageStatus == 3 ? 2 : status
      if (state.orderData.layFlag == 1)
        return ElMessage.warning({ message: '已搁置订单无法匹配商品' })
      if (state.orderData.forbidFlag == 1)
        return ElMessage.warning({ message: '已禁止订单无法匹配商品' })
      state.excludeSkuIds = []
      state.orderData.packageRels.forEach(v => {
        v.packageSkus.forEach(item => {
          if (item.packageSkuMatch && item.packageSkuMatch.operation != 3)
            state.excludeSkuIds.push(item.packageSkuMatch.skuId)
          item.packageGoods.forEach(ele => {
            if (ele.operation != 3) {
              if (ele.skuId) {
                state.excludeSkuIds.push(ele.skuId)
              } else [state.excludeSkuIds.push(ele.id + '')]
            }
          })
        })
      })
      state.matchData = {
        query: {
          sku,
          customization
        }
      }
      state.packageSkuId = key.packageSkuId
      state.matchOrderShow = true
    }

    // 匹配商品结果
    const initPages = data => {
      if (data) {
        //匹配成功,重新获取订单详情页面数据
        packageOrderDetailsFn()
        state.packageSkuId = null
        state.matchOrderShow = false
        state.checkLogs.page.pageNo = 1
        getOperationLogFn()
      }
    }
    onBeforeUnmount(() => {
      // 在组件销毁前执行
      window.removeEventListener('scroll', handleScroll, false)
    })

    const showShippingModal = () => {
      if (state.orderData.packageStatus != 9) {
        if (
          state.orderData.packageRels.some(v =>
            v.packageSkus.some(val => val.packageGoods.length == 0)
          )
        ) {
          // 订单商品未全部匹配
          state.isAllMatching = false
        } else {
          // 订单商品全部匹配
          state.isAllMatching = true
        }
        state.shippingForm.logisticsId = state.orderData.packageLogistics.id
        state.shippingForm.infos.logisticsId =
          state.orderData.packageLogistics.id
        state.shippingModal = true
      }
    }
    const closeModalFn = data => {
      state.shippingModal = data
      packageOrderDetailsFn()
      state.checkLogs.page.pageNo = 1
      getOperationLogFn()
    }

    const addressChange = () => {
      if (state.orderData.street2) {
        state.rules.street1 = ''
      } else {
        state.rules.street1 = [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }

    // 失焦是触发提示是否填写
    const tipsEmpty = (str, tips) => {
      if (!str) ElMessage.warning({ message: '请输入' + tips })
    }

    //校验重量和价格 正数，小数点保留两位，999999.99
    const pWeightPrice = (num, flag) => {
      num = num - 0
      if (num > 0) {
        if (!patternFn(num, 'weght') || num > 999999.99)
          return ElMessage.warning({
            message: '请输入正数，小数点保留两位，最大999999.99'
          })
      } else {
        if (flag == 1) {
          ElMessage.warning({ message: '请输入报关重量' })
        } else {
          ElMessage.warning({ message: '请输入报关价格' })
        }
      }
    }

    const close = data => {
      state.packageSkuId = null
      state.matchOrderShow = data
    }

    /*
     * 报关属性变化
     * 含电（内电）和 含电（纯电） 属性只能二选一
     */
    const checkboxGroup = (data, id, name) => {
      //   state.orderData.packageGoodsDetailsVOs.forEach(v => {
      //     if(v.id == id) {
      //       if(name == '含电（纯电）'){
      //         v.attrCheckedList = v.attrCheckedList.filter(item => item != '含电（内电）')
      //         v.attr[0].checked = false
      //       } else if(name == '含电（内电）'){
      //         v.attrCheckedList = v.attrCheckedList.filter(item => item != '含电（纯电）')
      //         v.attr[1].checked = false
      //       }
      //     }
      //   })
    }

    //获取物流弹框选择的信息
    function getLogistics(data, show) {
      state.shippingModal = show
    }

    function changeData(data) {
      if (data) {
        state.shippingModal = false
        packageOrderDetailsFn()
        state.checkLogs.page.pageNo = 1
        getOperationLogFn()
      }
    }

    // 获取按钮操作数据
    function getHookData() {
      if (state.orderData.packageLogistics) {
        const { trackNumber, trackType, logistics } =
          state.orderData.packageLogistics
        return {
          packageId:state.packageId,
          trackNumber,
          trackType,
          logistics
        }
      } else {
        return {
          packageId:state.packageId,
          trackNumber: null,
          trackType: null,
          logistics: null
        }
      }
    }

    // 审核包裹
    function examineFn() {
      const hookData = getHookData()
      orderDetailHooks(hookData).examine(cancelFn)
    }
    // 移入搁置
    function toShelveFn() {
      state.toShelveShow = true
    }
    function toShelveBack(data) {
      state.toShelveShow = false
      if (isAll) {
        packageOrderDetailsFn()
      } else {
        if (data)
          router.push({
            name: 'OrderManagement'
          })
      }
    }
    // 申请运单号
    function applicationWaybillNo() {
      if (
        state.orderData.packageRels.some(v =>
          v.packageSkus.some(val => val.packageGoods.length == 0)
        )
      ) {
        // 订单商品未全部匹配
        ElMessage.warning({ message: '请添加发货商品！' })
      } else {
        // 订单商品全部匹配 applyNum
        const hookData = getHookData()
        orderDetailHooks(hookData).applyNum(cancelFn)
      }
    }
    // 重新获取 <!-- 重新获取:3申请失败 , -1更换物流待处理-->
    function reacquireFn() {
      const hookData = getHookData()
      if (state.orderData.packageStatus == 3) {
        orderDetailHooks(hookData).applyNum(cancelFn)
      } else {
        orderDetailHooks(hookData).applyOrderNum(cancelFn)
      }
    }
    // 打印面单
    function printFn(data) {
      state.printInfoData = data
      state.printInfoShow = true
    }
    function printSheet() {
      const hookData = getHookData()
      orderDetailHooks(hookData).print(1, printFn)
    }
    function printInfoBack(val) {
      state.printInfoShow = false
      if (val) cancelFn()
    }
    // 打回待处理
    function callBackToBeProcessed() {
      const hookData = getHookData()
      if (isChangeLogist === 'false') {
        orderDetailHooks(hookData).pending(cancelFn)
      } else {
        orderDetailHooks(hookData).goPend(cancelFn)
      }
    }
    // 移入待打单
    function moveInOrderToBePrinted() {
      const hookData = getHookData()
      if (
        state.orderData.packageStatus == -1 ||
        state.orderData.packageStatus == -3
      ) {
        // 已交运移入待打单
        orderDetailHooks(hookData).moveToPrinted(cancelFn)
      } if(state.orderData.packageStatus == 7){
				// 打回待打单
				orderDetailHooks(hookData).returnWaitPrintFn(cancelFn)
			}else {
				// 移入待打单
        orderDetailHooks(hookData).addPrinted(cancelFn)
      }
    }
    // 补发赠品
    function reissueGifts() {
      router.push({
        name: 'reissueGifts',
        query: {
          packageId,
          orderId: state.orderData.packageRels[0].orderId
        }
      })
    }
    // 补打单
    function makeUpSheet() {
      state.reissuePrintedShow = true
      // const hookData = getHookData()
      // orderDetailHooks(hookData).print(2, printFn)
    }
    function printBack(val) {
      state.reissuePrintedShow = false
      if (val) {
        state.printInfoData = val
        state.printInfoShow = true
      }
    }

    // v-if="reissuePrintedShow"
    //   :data="{ packageIds: orderData.packageId, fromSourth: true }"
    //   :dialogVisible="true"
    //   :dialogTitle="'请选择补打原因'"
    // 	@emitBack="printBack"
    // 补发包裹
    function reissuePackage() {
      router.push({
        name: 'OrderSupply',
        query: {
          packageId
        }
      })
    }
    // 还原
    function reductionFn() {
      const hookData = getHookData()
      orderDetailHooks(hookData).reduction(cancelFn)
    }

    // 变更支付状态
    function changePaymentShowClick() {
      state.changePaymentShow = true
    }
    function changePaymentBack(val) {
      state.changePaymentShow = false
      if (val) packageOrderDetailsFn()
    }

    // 解除关系回执
    function dissolutionFn(val) {
      const { packageSkuId, sku } = val
      state.packageSkuId = packageSkuId
      state.packageSkuIdSku = sku
      state.dissolutionShow = true
    }
    function dissolutionBack(val) {
      state.dissolutionShow = false
      if (val) packageOrderDetailsFn()
    }

    // 退款总额
    function returnTotal(list) {
      if (list && list.length) {
        let priceNum = 0
        list.forEach(v => {
          if (v.status == '0') priceNum += v.amount - 0
        })
        return priceNum.toFixed(2)
      } else {
        return '0.00'
      }
    }

    // 退款
    function refundOrder() {
      state.refundDialogShow = true
    }

    return {
      ...toRefs(state),
      refundOrder,
      returnTotal,
      VOsPrice,
      printBack,
      VOsWeight,
      submitFnBody,
      dissolutionFn,
      changePaymentShowClick,
      dissolutionBack,
      changePaymentBack,
      customInfoFn,
      changeData,
      check,
      setGift,
      delChooseGoods,
      chooseFn,
      sureTips,
      closeTipsFn,
      getLogistics, //获取物流弹框选择的信息
      checkboxGroup, //报关属性变化
      close,
      tipsEmpty, //失焦是触发提示是否填写
      pWeightPrice, //校验重量和价格 正数，小数点保留两位，999999.99
      addressChange, //地址2改变
      handleScroll,
      handleChange,
      changeUserListSize, //切换页面数据数量
      changeUserListCurrent, //切换数据页码
      clickFn, //点击右侧--》锚点定位
      cancelFn, //页面取消
      backPrevFn,
      submitFn, //提交修改
      changeRadio, //切换币种
      closeRemarkFn, //关闭弹框
      sureRemarkFn, //弹框确定
      addRemarkFn, //新增备注信息
      sureDelRemarkFn, //确定删除备注
      deleteFn, //删除备注信息
      closeDelRemarkFn, //关闭删除
      matchShow, //匹配商品
      initPages, //匹配商品结果
      showShippingModal,
      closeModalFn,
      sideBarWidth,
      inputBlur,
      skuShow,
      isChangeLogist,
      examineFn,
      toShelveFn,
      applicationWaybillNo,
      reacquireFn,
      printSheet,
      callBackToBeProcessed,
      moveInOrderToBePrinted,
      reissueGifts,
      makeUpSheet,
      reissuePackage,
      reductionFn,
      toShelveBack,
      printInfoBack,
      goToPage,
      packageOrderDetailsFn,
			nunmberChange
    }
  }
}
</script>


<style lang="scss" scoped>
.OVClass {
  margin-left: 20px;
}
:deep(.el-form) {
  box-sizing: border-box;
  padding: 0 10px;
}
.contentList {
  height: 30px;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  // position: relative;
}
.hide {
  display: none;
}
:deep(.el-timeline-item__wrapper) {
  top: 0.03rem;
}
.delivery {
  max-height: 200px;
  overflow: auto;
  // border: 1px solid #e4e7ed;
  // background-color: #f5f7fa;
  // border-radius: 4px;
  box-sizing: border-box;
  padding: 0 5px;
  // padding: 0 20px;
}
:deep(.el-timeline-item__content) {
  position: relative;
  top: -3px;
}
.selectContainer {
  position: relative;
  line-height: 30px;
  .mySelect {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
  }
}
:deep(.el-icon-warning) {
  font-size: 24px;
  margin-right: 10px;
  color: #e6a23c;
  position: relative;
  top: 4px;
}
.remarkDialog {
  :deep(.el-radio__label) {
    width: 85px;
    display: inline-block;
  }
}
.orderDetailView {
  width: 100%;
  position: relative;
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  // .textAreaTitle {
  // :deep(.el-form-item__label) {
  //   position: relative;
  //   top: -20px;
  // }
  // }
  .orderDetailHeader {
    left: v-bind(sideBarWidth);
    width: calc(100% - v-bind(sideBarWidth));
    height: 116px;
    position: fixed;
    top: 109px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 30px;
    z-index: 9;
    .orderDetailHeaderTitle {
      font-size: 20px;
      line-height: 50px;
      font-weight: 500;
    }
    .orderBuyerInfo {
      line-height: 50px;
      font-size: 14px;
      color: #242526;
      .orderBuyerInfoList {
        margin-right: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
    }
  }
  .orderDetailRightSider {
    width: 10%;
    background-color: #fff;
    position: fixed;
    top: 245px;
    right: 0;
    border-radius: 2px;
    z-index: 3;
    .orderDetailRightSiderContent {
      width: 80%;
      margin: 20px 0 0 15%;
      .active {
        :deep(.el-timeline-item__content) {
          color: #1890ff;
        }
      }
    }
    :deep(.el-timeline-item:hover) {
      cursor: pointer;
      opacity: 0.75;
    }
  }
  .orderDetailBody {
    padding: 110px 20px 25px 0;
    box-sizing: border-box;
    width: 90%;
    .orderDetailList {
      background-color: #fff;
      margin-bottom: 24px;
      padding: 0 0 15px;
      .orderDetailTitle {
        margin-bottom: 24px;
      }
      .tableContainer {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        padding: 0 20px;
        .itemsImagesContainer {
          width: 70px;
          height: 70px;
          position: relative;
          .itemsImages {
            position: absolute;
            max-width: 100%;
            max-height: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .fl {
          margin-top: 10px;
          margin-bottom: 10;
        }
        .mtNone {
          margin-top: 0;
        }
        // :deep(.el-select){
        // transform: scale(0.7);
        // width: 62%;
        // vertical-align: middle;
        // }
      }
      .orderItemsContent {
        display: flex;
        margin: 10px 0;
        .orderItemsImageContainer {
          flex: 2;
          min-width: 90px;
          position: relative;
					height: 80px;
          img {
            max-width: 70px;
            max-height: 70px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .unmatched {
            color: #fff;
            font-size: 12px;
            position: absolute;
            right: 0;
            bottom: 0;
            background-color: #1890ff;
            line-height: 16px;
            padding: 0 5px;
          }
        }
        .orderItemsInfoContainer {
          flex: 6;
          box-sizing: border-box;
          padding: 0 10px;
          font-size: 12px;
          max-width: 63%;
          .itemTitle,
          .itemPrice{
            width: 100%;
            line-height: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #555658;
          }
					.itemSpec{
						width: 100%;
            line-height: 24px;
						color: #555658;
					}
          .itemTitle {
            color: #242526;
            font-weight: 500;
          }
        }
        .goodsNumContainer {
          flex: 1;
          min-width: 45px;
          text-align: right;
        }
      }
    }
    .threeList {
      .fl {
        width: 20%;
        box-sizing: border-box;
        padding-left: 1%;
      }

      .longInput {
        width: 80%;
        :deep(.el-form-item__label) {
          width: 10%;
        }
        :deep(.el-form-item__content) {
          width: 90%;
        }
      }
    }
  }
  .orderDetailFooter {
    left: v-bind(sideBarWidth);
    width: calc(100% - v-bind(sideBarWidth));
    position: fixed;
    bottom: 0;
    background-color: #fff;
    height: 52px;
    line-height: 52px;
    box-sizing: border-box;
    padding: 0 30px;
    border-top: 1px solid #e8ecef;
    z-index: 99;
  }
  #remarks {
    :deep(.el-table--fit) {
      max-height: 500px;
      overflow-y: scroll;
    }
  }
  .redColor {
    color: #ff4d4f;
  }
  .blueColor {
    color: #1890ff;
  }
  .cursor:hover {
    cursor: pointer;
    opacity: 0.75;
    background-color: #f5f7fa;
  }
  .orderDetailTitle {
    width: 100%;
    line-height: 55px;
    border-bottom: 1px solid #e9e9e9;
    text-indent: 30px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
  }
  .tableRightContainer {
    border: 1px solid #ebeef5;
    margin-left: 1%;
    width: 49.5%;
    .rightTableHeader {
      box-sizing: border-box;
      padding: 0 10px;
      height: 45px;
      span {
        line-height: 45px;
        margin-top: 0 !important;
      }
      .fl {
        margin-right: 10px;
      }
      .fr {
        cursor: pointer;
      }
    }
    .rightTableList {
      border-top: 1px solid #ebeef5;
      padding: 10px 0 17px;
      .unmatchedBtns {
        font-size: 12px;
        color: #1890ff;
        text-indent: 20px;
        line-height: 82px;
        margin-left: -10px;
        span {
          cursor: pointer;
        }
      }
      .unmatchedBtnsGray {
        color: #666;
      }
      .rightTableListImageContainer {
        width: 13.5%;
        height: 70px;
        position: relative;
        margin: 10px 0 0 10px;
        .replaceBtn {
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 20px;
          color: #ff4d4f;
          border-color: #ff4d4f;
        }
				.yellowBtn{
					color: #f6a439;
          border-color: #f6a439;
				}
        .rightTableListImage {
          max-width: 70px;
          max-height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .giftContainer {
          width: 20px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          position: absolute;
          right: 10px;
          top: 0;
          background-color: #1890ff;
          color: #fff;
        }
      }
      .rightTableListItemInfoContainer {
        width: 83%;
        margin-left: 1%;
        display: flex;
        .rightTableListItemInfo {
          flex: 2;
          position: relative;
          p {
            width: 95%;
            font-size: 12px;
            height: 24px;
            line-height: 24px;
          }
          .rightTableListItemInfoTitle {
            color: #242526;
            font-weight: 500;
						white-space: nowrap;
						overflow: hidden;
						-o-text-overflow: ellipsis;
						text-overflow: ellipsis;
          }
          .rightTableListItemInfoPrice,
          .rightTableListItemInfoSpev {
            color: #555658;
          }
        }
        .rightTableListItemTool {
          flex: 1;
          :deep(.el-input-number) {
            margin-top: 22px;
          }
          p {
            width: 100%;
            font-size: 12px;
            height: 24px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            cursor: pointer;
            color: #1890ff;
            margin-top: 28px;
          }
          .rightTableListItemToolBtn {
            text-align: center;
          }
        }
      }
    }
  }
  .orderInfoList {
    :deep(.el-radio) {
      margin-right: 0;
      text-indent: 10px;
    }
  }
  :deep(.el-select) {
    width: 100%;
  }
  .tipsContent {
    .remarkConatienr {
      margin-top: 20px;
      :deep(.el-textarea) {
        width: 530px;
      }
    }
  }
  :deep(.el-form-item__label) {
    width: 41%;
    display: inline-block;
  }
  :deep(.el-form-item__content) {
    width: 59%;
    display: inline-block;
  }
  :deep(th) {
    background-color: #ebeef5;
  }
  .colorRed {
    color: rgb(236, 95, 116);
  }
}
#orderInfo,
#shipping,
#finance {
  :deep(.el-form-item) {
    line-height: 32px;
  }
  :deep(.el-form-item) {
    margin-bottom: 5px !important;
  }
}
.shippingContent {
  display: flex;
  justify-content: space-between;
  .title-name {
    width: 100px;
  }
  div {
    height: 55px;
    line-height: 55px;
    overflow: hidden;
  }
  .reson-content {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>


