<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row>
          <Col span="4">
            <FormItem label="申请人" style="width: 100%">
              <Input v-model="applicant" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下单编号" style="width: 100%" prop="supplierOrderNumber">
              <Input v-model.trim="form.supplierOrderNumber" @on-change="orderChange"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="慕可代码" style="width: 100%">
              <Select v-model="form.mkCode" clearable @on-change="mkCodeChange">
                <Option v-for="mkCode in mkCodeList" :key="mkCode.label" :value="mkCode.value" :label="mkCode.label" />
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下单时间" style="width: 100%">
              <Input v-model="form.orderTime" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="包材名称" style="width: 100%">
              <Input v-model="form.packing" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="生产供应商" style="width: 100%">
              <Input v-model="form.supplier" readonly/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="类型" style="width: 100%">
              <Input v-model="form.packingType" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="订单数量" style="width: 100%">
              <Input v-model="form.amount" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="剩余可入库量" style="width: 100%">
              <Input v-model="remainNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="本次预计入库量" style="width: 100%" prop="expectedQuantity">
              <InputNumber :min="0" :max="remainNumber" style="width: 100%" v-model="form.expectedQuantity"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="仓位号" style="width: 100%" prop="positionNumber">
              <Input v-model="form.positionNumber"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="备注" style="width: 100%">
              <Input v-model="form.remark"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下级经办人" style="width: 100%">
              <Input value="IT开发部主管" disabled/>
            </FormItem>
          </Col>
        </Row>
        <div style="position: relative">
          <div class="necessary margin-bottom-10 font-size-12">送货单文件</div>
          <Upload
          ref="upload"
          :show-upload-list="false"
          :action="fileUploadURL"
          :headers="fileUploadHeaders"
          :before-upload="beforeUpload"
          :on-success="onsuccess"
          :on-remove="onremove"
          :on-error="onerror"
          >
            <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
          </Upload>
        <div style="color: #ff0000; font-size: 12px; margin-top: -10px">请上传供应商送货副联单</div>
          <div class="upload-list" v-for="(file, index) in form.fileItems" :key="index">
            <a :href="file.url" :download="file.name" class="download-link">{{file.name}}</a>
            <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index)"/>
          </div>
        </div>
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
        applicant: '',
        submintLodaing: false,
        spinShow: false,
        hasInfo: false,
        notFoundText: '无匹配数据',
        fileUrl: '',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        lastFiveYears: [],
        form: {
          supplierOrderNumber: '',
          mkCode: '',
          orderTime: '',
          packing: '',
          supplierId: null,
          supplier: '',
          amount: null,
          packingType: '',
          expectedQuantity: null,
          positionNumber: '',
          remark: '',
          fileItems: [],
        },
        rules: {
          supplierOrderNumber: [{required: true, message: '必填项', trigger: 'change'}],
          expectedQuantity: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
          positionNumber: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        mkCodeList: [],
        numberByOrder: null
        // change: this.$debonce(this.orderChange, 500, 'footer')
      }
    },
    methods: {

      orderChange() {
        // TODO: 调取采购系统的接口 获取mkCode
        // console.log(this.form.supplierOrderNumber)
        this.mkCodeList = []
        this.notFoundText = '加载中...'

        this.getSupplyInfo({order_no: this.form.supplierOrderNumber}).then(res => {
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
          this.getNumberByOrder(this.form.supplierOrderNumber)
        }).catch(err => {
          console.log(err)
        })

      },

      mkCodeChange() {
        let {mkCode, supplierOrderNumber} = this.form
        if(!supplierOrderNumber) return
        // console.log(mkCode, supplierOrderNumber)

        let info = this.supplyInfo.find(items => mkCode === items.mk_code && supplierOrderNumber === items.order_no)
        if(info) {
          this.form.packing = info.packing
          this.form.packingType = info.type // product_type
          this.form.amount = +info.amount
          this.form.supplier = info.supplier
          this.form.supplierId = info.supplier_id
          this.form.orderTime = info.created_at == 0 ? '' : info.created_at
          this.hasInfo = true
        }else {
          this.hasInfo = false
          this.$Message.warning('请确认包材订单号，慕可代码是否正确')
        }
      },


      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            console.log(this.form)
            if (this.form.fileItems.length <= 0) return this.$Message.error('请上传供应商送货副联单')
            // return console.log(this.form)
            // this.submintLodaing = true
            let params = JSON.parse(JSON.stringify(this.form))
            let api = 'addStorageApply'
            if (this.id) {
              params.id = this.id
              api = 'editStorageApply'
            }
            this.$API[api](params).then(res => {
              if (res.code === 0) {
                this.$Message.success(res.msg)
                this.$router.push('/storage-management/storage-application')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },
      beforeUpload(file) {
        const check = /.txt$/.test(file.name)
        // this.$Message.info('正在上传')
        if (check) {
          this.$Message.warning('请不要上传txt格式的文件')
        }
        return !check;
      },
      onsuccess(response) {
        if (response.code === 0) {
          this.$Message.success(response.msg)
          console.log(response)
          this.form.fileItems.push(response.data.fileUploadVo)
        } else {
          this.$Message.error('上传有误')
        }
      },
      onerror(error) {
        this.$Message.error('上传失败')
      },
      onremove(index) {
        this.form.fileItems.splice(index, 1)
      },

      // 获取详情
      getDetail(id) {
        // this.spinShow = true
        this.$API.getStorageDetail(id).then(res => {
          console.log(res)
            if(res.code !== 0) return
              let data = res.data
              this.form =  {
                supplierOrderNumber: data.supplier_order_number,
                mkCode: data.mk_code,
                orderTime: data.order_time,
                packing: data.packing,
                supplierId: data.supplier_id,
                supplier: data.supplier,
                amount: data.amount,
                packingType: data.packing_type,
                expectedQuantity: data.expected_quantity,
                positionNumber: data.position_number,
                remark: data.remark,
                fileItems: data.delivery_file,
              },
              this.orderChange()
              this.spinShow = false
        })
      },
      // 获取 统计包材订单待确认入库量+已实际入库量
      getNumberByOrder(orderNumber) {
        this.$API.getNumberByOrder({orderNumber}).then(res => {
          if (res.code === 0) {
            this.numberByOrder = res.data[0]
          }
        }).finally(() => {
          this.spinShow = false
        })
      },
      // 获取 通过批次号统计入库数量(待确认+已确认)
      // getNumberByBatch() {
      //   this.spinShow = true
      //   this.$API.getNumberByBatch({orderNumber}).then(res => {
      //     if (res.code === 0) {
      //
      //     }
      //   }).finally(() => {
      //     this.spinShow = false
      //   })
      // },

      // 采购系统api
      supplyInstance() {
        const BASE_URL = ENV === 'production' ? 'http://apisupply.fandow.com/' : 'http://apisupplytest.fandow.com/'
        this.instance = axios.create({
          baseURL: BASE_URL,
          timeout: 20000,
          headers: {'Authorization': 'Bearer nTYEm7oNMGChXer3AhIy4cBkTYcQfdUOdJJVuQ3X'}
        });
      },

      getSupplyInfo(params) {
        return this.instance.get('/v1/search/search-order-packing', {params})
          .then(res => {
            return res.data
          }).catch(err => {
            if (err) return console.log(err.message)
          })
      },


    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.applicant = userInfo.realName

      console.log(this.$route.query)
      this.supplyInstance()
      if (this.id) {
        this.getDetail(this.id)
      }
    },
    computed: {
      remainNumber() {
        // TODO: 下单 - （待确认 + 实际）
        // this.numberByOrder = 10
        return this.form.amount ? (this.form.amount - this.numberByOrder) + '' : ''
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

  .upload-list {
    padding: 3px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .upload-list:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    display: none;
  }

  .upload-list:hover .icon-trash {
    display: block;
    cursor: pointer;
  }
</style>