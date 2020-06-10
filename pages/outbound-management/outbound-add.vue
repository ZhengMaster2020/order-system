<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row>
          <FormItem label="申请人">
            <Input class="width-200" v-model="form.applicant" readonly/>
          </FormItem>
          <FormItem label="品牌">
            <Select v-model="form.brand" placeholder="品牌" class="width-200">
              <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>
            </Select>
          </FormItem>
          <FormItem label="灌包订单号" prop="gbOrderSn">
            <Input style="width: 220px" v-model="form.gbOrderSn" @on-change="change"/>
          </FormItem>
          <FormItem label="慕可代码">
            <Select v-model="form.mkCode" class="width-200" @on-change="mkCodeChange">
              <Option v-for="mkCode in mkCodeList"
                      :key="mkCode.label"
                      :value="mkCode.label"
                      :not-found-text="notFoundText">{{mkCode.value}}</Option>
            </Select>
          </FormItem>
          <FormItem label="产品名称">
            <Input class="width-200" v-model="form.productName" readonly/>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="下单数量">
            <Input class="width-200" v-model="form.orderNumber" readonly/>

          </FormItem>
          <FormItem label="产品类型">
            <Input class="width-200" v-model="form.productType" readonly/>
          </FormItem>


          <FormItem label="供应商名称">
            <Input style="width: 220px" v-model="form.supplier" readonly/>
          </FormItem>
          <FormItem label="要求期货">
            <Input class="width-200" v-model="form.requireDeliveryTime" readonly/>
          </FormItem>
          <FormItem label="紧急程度">
            <Input class="width-200" v-model="form.urgency"/>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="是否补发" prop="isReissue">
            <Select v-model="form.isReissue" class="width-200" @on-change="resetExpectNum">
              <Option :value="1">是</Option>
              <Option :value="0">否</Option>
            </Select>
          </FormItem>
          <FormItem label="补发类型" prop="reissueType">
            <Select v-model="form.reissueType"
                    class="width-200"
                    @on-change="resetExpectNum"
                    :disabled="form.isReissue === 1 ? false : true">
              <Option value="loss">损耗</Option>
              <Option value="other">其他</Option>
            </Select>
          </FormItem>
          <FormItem label="损耗记录单" prop="lossSn">
            <Input style="width: 220px" v-model.trim="form.lossSn" :disabled="form.isReissue === 1 ? false : true"/>
          </FormItem>
          <FormItem label="损耗数量" prop="lossNumber">
            <Input class="width-200" v-model="form.lossNumber" disabled/>
          </FormItem>
          <FormItem label="下级经办人" prop="nextBy">
            <Input class="width-200" v-model="form.nextBy" disabled/>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="剩余可出库量">
            <Input class="width-200" v-model="remainNum" readonly/>
          </FormItem>
          <FormItem label="本次预计出库量" prop="expectedOutboundNumber">
            <!--            <Input class="width-200" v-model="form.expectedOutboundNumber"/>-->
            <InputNumber :min="0"
                         :max="expectedMaxNum"
                         :precision='0'
                         :formatter="value => `${value}`.replace(/\B(?=(?:\d{3})+\b)/g, ',')"
                         :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                         class="width-200"
                         v-model="form.expectedOutboundNumber"/>
          </FormItem>
          <FormItem label="出库理由" prop="outboundReason">
            <Input style="width: 633px" v-model.trim="form.outboundReason"/>
          </FormItem>
        </Row>

      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '../../api/config'
  import ENV from "../../api/env";
  import axios from "axios";

  export default {
    data() {
      return {
        submintLodaing: false,
        spinShow: false,
        gbOrderSnNum: '',
        notFoundText: '无匹配数据',
        mkCodeList: [],
        form: {
          orderNumber: null,
          gbOrderSn: '',
          mkCode: '',
          productName: '',
          productType: '',
          requireDeliveryTime: '',
          supplier: '',
          urgency: '',
          isReissue: 0,
          reissueType: 'other',
          lossSn: '-',
          lossNumber: '-',
          expectedOutboundNumber: null,
          outboundReason: '',
          brand: 'WIS',
          //
          nextBy: '产品供应部-经理',
          // remainNumer: null,
          applicant: '',
        },
        rules: {
          gbOrderSn: [{required: true, message: '必填项', trigger: 'blur'}],
          urgency: [{required: true, message: '必填项', trigger: 'blur'}],
          reissueType: [{required: true, message: '必填项', trigger: 'change'}],
          lossSn: [{required: true, message: '必填项', trigger: 'change'}],
          nextBy: [{required: true, message: '必填项', trigger: 'blur'}],
          outboundReason: [{required: true, message: '必填项', trigger: 'blur'}],
          lossNumber: [{required: true, message: '必填项', trigger: 'change'}],
          isReissue: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
          expectedOutboundNumber: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
        },

        brandList: [
          {value: 'WIS', label: 'WIS'},
          {value: '柏菲娜', label: '柏菲娜'},
          {value: 'IRY', label: 'IRY'},
          {value: 'MVE', label: 'MVE'},
          {value: '魔渍', label: '魔渍'},
          {value: 'KONO', label: 'KONO'},
          {value: '墨雪', label: '墨雪'},
        ],

        supplyInfo: [],
        hasInfo: false,

        change: this.$debonce(this.gbOrderSnChange, 500, 'footer')

      }


    },
    watch: {
      ['form.reissueType'](cur) {
        // this.form.lossSn = cur !== 'loss' ? '-' : ''
        // && (this.form.lossNumber = '-')
      },
      ['form.isReissue'](cur) {
        if(cur !== 1) {
          this.form.reissueType = 'other'
          this.form.lossSn = '-'
        }else {
          this.form.lossSn = ' '
        }
      }
    },
    computed: {
      remainNum() {
        // 下单数量 - 汇总该灌包订单在出库记录中【待确认】+【已确认】的数量
        console.log(this.form.orderNumber, this.gbOrderSnNum)
        return this.hasInfo ? this.form.orderNumber - this.gbOrderSnNum : null
      },
      expectedMaxNum() {
        let max = null
        if (this.form.isReissue === 1 && this.form.reissueType === '损耗') {
          max =  Number(this.remainNum) + Number(this.form.lossNumber)
        } else {
          /*  非补发 (或者补发但不是损耗状态)情况下： 预计本次出库量 不大于 剩余可出库数量 */
          max = Number(this.remainNum)
        }

        if(this.hasInfo){
          this.form.expectedOutboundNumber = this.form.expectedOutboundNumber > max ? max : this.form.expectedOutboundNumber
        }
        return max
      }
    },
    methods: {
      resetExpectNum() {
        this.form.expectedOutboundNumber = null
      },

      gbOrderSnChange(){
        // TODO: 调取采购系统的接口 获取mkCode
        console.log(this.form.gbOrderSn)
        this.notFoundText = '加载中...'

        this.getSupplyInfo({order_no: this.form.gbOrderSn}).then(res => {
          if(res.code !== 200 || res.data.length === 0) {
            this.notFoundText = '无匹配数据'
            this.mkCodeList = []
            return
          }

          this.supplyInfo = res.data
          let mkCodeList = res.data.map(items => {
            this.notFoundText = ''
            return items.mk_code
          })
          this.mkCodeList = [...new Set(mkCodeList)].map(items => ({value: items, label: items}))

        }).then(() => {
          this.getOutboundOrderNum()
        }).catch(err => {
          console.log(err)
        })


      },

      mkCodeChange() {
        let {mkCode, gbOrderSn} = this.form
        if(!gbOrderSn) return
        console.log(mkCode, gbOrderSn)

        let info = this.supplyInfo.find(items => mkCode === items.mk_code && gbOrderSn === items.order_no)
        if(info) {
          this.form.productName = info.product
          this.form.productType = this.switchProType(info.product_type) // product_type
          this.form.orderNumber = info.amount
          this.form.supplier = info.supplier
          this.form.requireDeliveryTime = info.demand_delivery == 0 ? '' : info.demand_delivery
          this.hasInfo = true
        }else {
          this.hasInfo = false
          this.$Message.warning('请确认灌包订单号，慕可代码是否正确')
        }
      },

      switchProType(type) {
        let productType = {
          1: '新品',
          2: '优化品',
          3: '常规品'
        }
        return productType[type]
      },

      submit() {
        // this.submintLodaing = true
        this.$refs.form.validate(val => {
          if (!val) return

          if(!this.form.mkCode) return this.$Message.error('请选择慕可代码')

          let apiKey = 'addOutboundLsit'
          let params = JSON.parse(JSON.stringify(this.form))

          delete params.nextBy
          delete params.applicant
          // TODO: 补发类型 损耗记录单 ('-' 则删除) --- 删除
          for(let key in params) {
            params[key] === '-' && delete params[key]
          }

          if(params.isReissue === 0){
            params.reissueType = ''
          }
          if(!params.lossSn){
            delete params.lossNumber
          }
          if(this.id) {
            params.id = this.id
            apiKey = 'editOutboundLsit'
          }

          // console.log(params)
          this.$API[apiKey](params).then(res => {
            if (res.code !== 0) return
            this.$Message.success(res.msg)
            this.$router.push('/outbound-management/CKSQ-outbound-application')
            this.submintLodaing = false
          })
        })
      },


      // 采购系统api
      supplyInstance() {
        const BASE_URL = ENV === 'production' ? 'http://apisupply.fandow.com' : 'http://serach.api-supplybeta.fandow.com'
        this.instance = axios.create({
          baseURL: BASE_URL,
          timeout: 20000,
          headers: {'Authorization': 'Bearer nTYEm7oNMGChXer3AhIy4cBkTYcQfdUOdJJVuQ3X'}
        });
      },

      getSupplyInfo(params) {
        return this.instance.get('/v1/search/search-order-bagging', {params})
          .then(res => {
            return res.data
          }).catch(err => {
            if (err) return console.log(err.message)
          })
      },

      getOutboundOrderNum() {
        // 获取统计灌包订单未确认+已确认出库数量
        this.$API.getGBOrderSnNum({ gbOrderSn: this.form.gbOrderSn }).then(res => {
          console.log(res)
          if (res.code !== 0) return
          this.gbOrderSnNum = Number(res.data[0])
        })
      },

      getOutboundApplySnNum(id) {
        // 获取出库申请单待确认出库+已确认出库数量
        this.$API.getOutboundApplySnNum(id).then(res => {
          // console.log(res)
          if (res.code !== 0) return
          // this.gbOrderSnNum = Number(res.data[0]) + Number(res.data[1])
          this.gbOrderSnNum = Number(res.data[0])
        })
        // this.gbOrderSnNum = 500
      },

      getOutboundDetail(id) {
        this.$API.getOutboundLsitDetail(id).then(res => {
          if (res.code !== 0) return
          this.spinShow = false
          this.hasInfo = true
          for (let key in res.data) {
            this.form[key] = res.data[key]
          }
          this.form.isReissue = res.data.isReissue === '是'? 1 : 0
          this.form.reissueType = res.data.reissueType ? res.data.reissueType : 'other'
          this.form.lossSn = this.form.lossSn ? this.form.lossSn : '-'
          this.form.lossNumber = this.form.lossNumber + ''
        })
      },

    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.form.applicant = userInfo.realName
      this.supplyInstance()
      // alert(this.$route.query.id)
      if(this.id) {
        this.getOutboundApplySnNum(this.id)
        this.getOutboundDetail(this.id)
      }
    }
  }
</script>

<style scoped>
  .width-200 {
    width: 200px;
  }

  .font-size-12 {
    font-size: 12px;
  }

  .necessary:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }

</style>