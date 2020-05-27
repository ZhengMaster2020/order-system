<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row>
          <FormItem label="申请人">
            <Input class="width-200" v-model="form.applicant" disabled/>
          </FormItem>
          <FormItem label="品牌">
            <Select v-model="form.brand" placeholder="品牌" class="width-200">
              <Option v-for="brand in brandList" :key="brand.label" :value="brand.label">{{brand.value}}</Option>
            </Select>
          </FormItem>
          <FormItem label="灌包订单号" prop="gbOrderSn">
            <Input class="width-200" v-model="form.gbOrderSn" @on-change="change"/>
          </FormItem>
          <FormItem label="慕可代码">
            <Select v-model="form.mkCode" class="width-200">
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

          <FormItem label="要求期货">
            <Input class="width-200" v-model="form.requireDeliveryTime" readonly/>
            <!--            <DatePicker type="date"-->
            <!--                        class="width-200"-->
            <!--                        v-model="requireDeliveryTime"-->
            <!--                        @on-change="date => {requireDeliveryTime = date}"></DatePicker>-->
          </FormItem>
          <FormItem label="供应商名称">
            <Input class="width-200" v-model="form.supplier" readonly/>
          </FormItem>
          <FormItem label="紧急程度" prop="urgency">
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
              <Option value="损耗">损耗</Option>
              <Option value="其他">其他</Option>
            </Select>
          </FormItem>
          <FormItem label="损耗记录单" prop="lossSn">
            <Input class="width-200"
                   v-model="form.lossSn" :disabled="form.reissueType === '损耗' ? false : true"/>
          </FormItem>
          <FormItem label="损耗数量" prop="lossNumber">
            <Input class="width-200"
                   v-model="form.lossNumber" disabled/>
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
            <Input style="width: 633px" v-model="form.outboundReason"/>
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

  export default {
    data() {
      return {
        submintLodaing: false,
        spinShow: false,
        gbOrderSnNum: '',
        notFoundText: '无匹配数据',
        mkCodeList: [
          // MK-GB-20052338251
          { value: 'MK60003', label: 'MK60003'},
          { value: 'MK60004', label: 'MK60004'},
          { value: 'MK61071', label: 'MK61071'},
          { value: 'MK60001', label: 'MK60001'},
        ],
        form: {
          orderNumber: 10000,
          gbOrderSn: 'MK-GB-20052338251', // 关联采购订单号
          mkCode: 'MK60003', // 关联采购订单号
          productName: '+WIS+黑头导出精华液', // 关联采购订单号
          productType: '单品', // 关联采购订单号
          requireDeliveryTime: '2020-05-23', // 关联采购订单号
          supplier: '广州仟智生物科技有限公司', // 关联采购订单号
          urgency: '', // 关联采购订单号
          isReissue: 0,
          reissueType: '其他',
          lossSn: '-',
          lossNumber: 0, // 关联采购订单号
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
          lossNumber: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
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

        change: this.$debonce(this.gbOrderSnChange, 500, 'footer')

      }


    },
    watch: {
      ['form.reissueType'](cur) {
        // if(cur !== '损耗') {
        //   this.form.lossSn = '-'
        // }else {
        //   this.form.lossSn = ''
        // }
        this.form.lossSn = cur !== '损耗' ? '-' : ''
        // && (this.form.lossNumber = '-')
      },
      ['form.isReissue'](cur) {
        console.log(cur)
        cur !== 1 && (this.form.reissueType = '其他')
        console.log(this.form.reissueType)
      }
    },
    computed: {
      remainNum() {
        // 下单数量 - 汇总该灌包订单在出库记录中【待确认】+【已确认】的数量
        return this.form.orderNumber - this.gbOrderSnNum
      },
      expectedMaxNum() {
        let max = null
        if (this.form.isReissue === 1 && this.form.reissueType === '损耗') {
          max =  Number(this.remainNum) + Number(this.form.lossNumber)
        } else {
          /*  非补发 (或者补发但不是损耗状态)情况下： 预计本次出库量 不大于 剩余可出库数量 */
          max = Number(this.remainNum)
        }

        this.form.expectedOutboundNumber = this.form.expectedOutboundNumber > max ? max : this.form.expectedOutboundNumber
        // console.log(max)
        return max
      }
    },
    methods: {
      resetExpectNum() {
        this.form.expectedOutboundNumber = null
      },

      gbOrderSnChange(){
        // 获取mkCode
        console.log(this.form.gbOrderSn)
        this.notFoundText = '加载中...'
        setTimeout(()=> {
          if(this.form.gbOrderSn === 'MK-GB-20051184191'){
            this.mkCodeList = [
              { value: 'MK60001', label: 'MK60001'},
            ]
            this.notFoundText = ''
            this.form.mkCode = this.mkCodeList[0].value
          }else{
            this.notFoundText = '无匹配数据'
          }

        }, 1000)

        this.getOutboundOrderNum()
      },
      submit() {
        // this.submintLodaing = true
        this.$refs.form.validate(val => {
          if (!val) return

          let apiKey = 'addOutboundLsit'
          let params = JSON.parse(JSON.stringify(this.form))

          delete params.nextBy
          delete params.applicant
          // TODO: 补发类型 损耗记录单 ('-' 则删除) --- 删除
          for(let key in params) {
            params[key] === '-' && (params[key] = '')
          }

          if(this.id) {
            params.id = this.id
            apiKey = 'editOutboundLsit'
          }

          console.log(params)
          this.$API[apiKey](params).then(res => {
            if (res.code !== 0) return
            this.$Message.success(res.msg)
            this.$router.push('/outbound-management/CKSQ-outbound-application')
            this.submintLodaing = false
          })
        })
      },
      getOutboundOrderNum() {
        let params = {
          gbOrderSn: this.form.gbOrderSn || '1321231412414'
        }
        // this.$API.getGBOrderSnNum(params).then(res => {
        //   console.log(res)
        //   if (res.code !== 0) return
        //   this.gbOrderSnNum = Number(res.data[0]) + Number(res.data[1])
        // })
        this.gbOrderSnNum = 500
      },

      getOutboundDetail(id) {
        this.$API.getOutboundLsitDetail(id).then(res => {
          console.log(res)
          if (res.code !== 0) return
          this.spinShow = false
          for (let key in res.data) {
            this.form[key] = res.data[key]
          }
        })
      },

    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.form.applicant = userInfo.realName
      // alert(this.$route.query.id)
      this.id && this.getOutboundDetail(this.id)
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