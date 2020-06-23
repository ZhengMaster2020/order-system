<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row class="margin-bottom-10 title">
          <Col>
            基础信息
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="申请时间" style="width: 100%">
              <Input v-model="detailData.createdAt" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="品牌" style="width: 100%">
              <Input v-model="detailData.brand" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库单号" style="width: 100%">
              <Input v-model="detailData.outboundOrderSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="灌包订单号" style="width: 100%">
              <Input v-model="detailData.gbOrderSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="订单数量" style="width: 100%">
              <Input v-model="detailData.orderNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="预计本次出库量" style="width: 100%">
              <Input v-model="detailData.expectedOutboundNumber" readonly/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
            <FormItem label="剩余可出库量" style="width: 100%">
              <Input v-model="detailData.orderNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="要求货期" style="width: 100%">
              <Input v-model="detailData.requireDeliveryTime" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="供应商名称" style="width: 100%">
              <Input v-model="detailData.supplier" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="慕可代码" style="width: 100%">
              <Input v-model="detailData.mkCode" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="产品名称" style="width: 100%">
              <Input v-model="detailData.productName" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="紧急程度" style="width: 100%">
              <Input v-model="detailData.urgency" readonly/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
             <FormItem label="是否补发" style="width: 100%">
              <Input v-model="detailData.isReissue" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="补发类型" style="width: 100%">
              <Input v-model="detailData.reissueType" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="损耗记录单" style="width: 100%">
              <Input v-model="detailData.lossSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="损耗数量" style="width: 100%">
              <Input v-model="detailData.lossNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="8">
             <FormItem label="出库理由" style="width: 100%">
              <Input v-model="detailData.outboundReason" readonly/>
            </FormItem>
          </Col>
        </Row>


        <Row class="margin-bottom-10">
          <Col >
            <span class="title">手动出库</span>
            <a style="font-size: 12px" href="javascript:void(0)" @click="toOutbountRecord">&nbsp;&nbsp;&nbsp;点击供应商查看出库记录>></a>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="出库人员" style="width: 100%" prop="realName">
              <Input v-model="form.realName" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="实际点货总量" style="width: 100%">
              <Input v-model="actualNumberTotal" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库单剩余可出库量" style="width: 100%">
              <Input :value="detailData.expectedOutboundNumber - detailData.remainNumTotal" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库仓位号" style="width: 100%">
              <Input v-model="form.warehouseSn" :readonly="id ? true : false"/>
            </FormItem>
          </Col>
          <Col span="8">
            <div class="upload-list-wrap">
              <div>
                <div class="necessary margin-bottom-10 font-size-12">上传出库回传单</div>
                <Upload
                ref="upload"
                :format="['jpg','jpeg','png']"
                :show-upload-list="false"
                :action="fileUploadURL"
                :headers="fileUploadHeaders"
                :on-format-error="(file) => onFormatError(file, '回传单')"
                :before-upload="(file) => beforeUpload(file, '回传单')"
                :on-success="(response) => onsuccess(response, '回传单')"
                :on-error="(error) => onerror(error, '回传单')"
                >
                  <Button icon="ios-cloud-upload-outline" class="margin-bottom-10" :disabled="id ? true : false">Upload files</Button>
                </Upload>
              </div>
              <div class="upload-file">
                <div class="upload-list" v-for="(file, index) in form.fileItems" :key="index">
                  <a href="javascript:void(0)" class="download-link" @click="showImageModal(file.url)">{{file.name}}</a>
                  <Icon v-if="file.uid" type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index, '回传单')"/>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row class="margin-bottom-10">
          <Col span="20">
            <div class="upload-list-wrap">
              <div class="margin-right-10">
                <div class="margin-bottom-10 font-size-12">导入序列号表格</div>
                <Upload
                :show-upload-list="false"
                :format="['xls','xlsx']"
                :action="fileUploadURL"
                :headers="fileUploadHeaders"
                :on-format-error="(file) => onFormatError(file, '导入序列号')"
                :before-upload="(file) => beforeUpload(file, '导入序列号')"
                :on-success="(response) => onsuccess(response, '导入序列号')"
                :on-error="(error) => onerror(error, '导入序列号')"
                >
                  <Button icon="ios-cloud-upload-outline" class="margin-bottom-10" :disabled="id ? true : false">Upload files</Button>
                </Upload>
              </div>
              <div class="upload-list serialdata" v-for="(file, index) in form.serialCodeItems">
                <a :key="index" :href="file.url" :download="file.name" class="download-link">{{file.name}}</a>
                <Icon v-if="file.uid" type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index, '导入序列号')"/>
              </div>
            </div>
          </Col>
          <Col span="4" style="text-align: right; margin-top: 35px">
            <Button type="primary" @click="exportOutboundtemplate">下载导入模板</Button>
          </Col>
        </Row>

        <Row v-for="(serial, index) in this.form.serialCodeData" :key="index">
          <Col span="2">
            <FormItem :label="index === 0? '序号' : ''" style="width: 100%">
              <Input v-model="serial.number" readonly/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label="index === 0? '编号' : ''"
                      style="width: 100%"
                      :prop="'serialCodeData.' + index + '.serialCodeSn'"
                      :rules="rules.serialCodeSn">
              <Input v-model="serial.serialCodeSn" maxlength="1" :readonly="serial.readonly"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '序列号起止' : ''"
                      style="width: 100%;"
                      :prop="'serialCodeData.' + index + '.startNumber'"
                      :rules="rules.startNumber">
<!--              <Input v-model="serial.startNumber" :readonly="serial.readonly"/>-->
              <InputNumber style="width: 100%;" :min="0" :max="99999999" v-model="serial.startNumber" @on-change="numberChange(index)" :readonly="serial.readonly"/>
            </FormItem>
          </Col>
          <Col span="1" :style="index === 0 ? crossStyle : {'text-align': 'center'}">——</Col>
          <Col span="4">
            <FormItem :style="index === 0 ? endNumStyle : {'width' : '100%'}">
<!--              <Input v-model="serial.endNumber" :readonly="serial.readonly"/>-->
              <InputNumber style="width: 100%;" :min="0" :max="99999999" v-model="serial.endNumber" @on-change="numberChange(index)" :readonly="serial.readonly"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '理论出库量' : ''" style="width: 100%">
              <Input :value="(serial.endNumber === null || !serial.endNumber) ? '' : serial.endNumber - serial.startNumber + 1" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem :label="index === 0? '实际点货量' : ''" style="width: 100%">
              <InputNumber style="width: 100%;" :min="1" :max="serial.endNumber - serial.startNumber + 1" v-model="serial.actualQuantity" @on-change="numberChange(index)" :readonly="serial.readonly"/>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem :label="index === 0? ' ' : ''" :style="index === 0 ? endNumStyle : {}">
              <Button shape="circle" icon="md-add" @click="addSerialData" v-if="index === 0 && !id"></Button>
              <Button style="margin-left: 12px" shape="circle" icon="md-remove" @click="removeSerialData(index)" v-if="index !== 0 && !serial.readonly"></Button>
            </FormItem>
          </Col>
        </Row>

        <Row class="margin-top-10">
          <Col span="2" offset="15"  style=" text-align: right; padding-top: 10px"> 总计 </Col>
          <Col span="4"><Input v-model="actualNumberTotal" readonly/></Col>
        </Row>

      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>

    <!--  回传单预览  -->
    <Modal title="回传单附件" v-model="imageModal.show" footer-hide>
      <img :src="imageModal.imgUrl" v-if="imageModal.show" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '../../api/config'

  export default {
    data() {
      return {
        id: '',
        submintLodaing: false,
        spinShow: false,
        requireDeliveryTime: '',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        // serialCodeDataURL: `${SERVER_BASE_URL}traceability/outbound-apply/data-import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        userInfo: {},
        serialFileName: '',
        fileItem: null,
        form: {
          realName: '',
          outboundApplyId: null,
          warehouseSn: '',
          fileItems: [],

          serialCodeData: [
            {
              number: 1,
              serialCodeSn: '',
              startNumber: null,
              endNumber: null,
              actualQuantity: null,
              readonly: false,
            }
          ],
          serialCodeItems: [],
        },
        imageModal: {
          show: false,
          imgUrl: ''
        },
        rules: {
          gbOrderSn: [{required: true, message: '必填项', trigger: 'blur'}],
          realName: [{required: true, message: '必填项', trigger: 'blur'}],
          reissueType: [{required: true, message: '必填项', trigger: 'blur'}],
          serialCodeSn: [{required: true, message: '须大写字母', trigger: 'blur', pattern: /^[A-Z]/}],
          startNumber: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
          lossSn: [{required: true, message: '必填项', trigger: 'blur'}],
          lossNumber: [{required: true, message: '必填项', trigger: 'blur'}],
          nextBy: [{required: true, message: '必填项', trigger: 'blur'}],
          expectedOutboundNumber: [{required: true, message: '必填项', trigger: 'blur'}],
          outboundReason: [{required: true, message: '必填项', trigger: 'blur'}],
          generationCount: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
        },
        detailData: {
          createdBy: '',
          createdAt: '',
          outboundOrderSn: '',
          brand: '',
          gbOrderSn: '',
          orderNumber: '',
          mkCode: '',
          productName: '',
          productType: '',
          requireDeliveryTime: '',
          supplier: '',
          isReissue: '',
          reissueType: '',
          lossSn: '',
          outboundReason: '',
          handleBy: '',
          expectedOutboundNumber: '',
          remainNumTotal: '',
        },
        crossStyle: {
          'padding-top': '34px',
          'text-align': 'center'
        },
        endNumStyle: {
          'width': '100%',
          'padding-top': '34px'
        },
        importData: [],
        numberChange: this.$debonce(this.endNumChange, 1000, 'footer')
      }
    },
    methods: {
      showImageModal(imgUrl) {
        this.imageModal.show = true
        this.imageModal.imgUrl = imgUrl
      },

      toOutbountRecord() {
        this.$router.push({
          name: 'outbound-management/CKSQ-outbound-application',
          params: {
            currentTab: 'outboundRecord'
          }
        })
      },

      beforeUpload(file, type) {
        if(this.id) {
          this.$Message.error('文件无法更改')
          return false
        }
        if(type === '回传单'){

        } else {
          // 单个文件 会覆盖？ 文件名即出库单号
          let index = file.name.lastIndexOf('.')
          let fileName = file.name.substring(0, index)
          const check = fileName !== this.detailData.outboundOrderSn
          if(check){
            this.$Message.error('文件名于出库单号不一致')
          }else {
            this.fileItem = file
          }
          return !check;
        }

      },

      onFormatError(response, type) {
        if(type === '回传单') {
          this.$Message.error('请按图片格式上传:".jsp, .png, .jpeg"')
        }else {
          this.$Message.error('请按excel文件格式上传')
        }
      },
      onsuccess(response, type) {
        if(type === '回传单') {
          if (response.code === 0) {
            this.$Message.success(response.msg)
            response.data.fileUploadVo.uid = Date.now()
            this.form.fileItems.push(response.data.fileUploadVo)
          } else {
            this.$Message.error('上传有误')
          }
        } else {
          if(response.code !== 0) return
          response.data.fileUploadVo.uid = this.fileItem.uid

          let formdata = new FormData()
          formdata.append('file', this.fileItem)

          this.$API.importSerialCodeData(formdata).then(res => {
            if(res.code !== 0) return
            let serialCodeData = this.form.serialCodeData

            let importData = res.data.importData.map(items => {
              // items.readonly = true
              return {
                uid: this.fileItem.uid,
                readonly: true,
                number: +items.number,
                serialCodeSn: items.serial_code_sn,
                startNumber: +items.start_number,
                endNumber: +items.end_number,
                actualQuantity: +items.actual_number
              }
            })

            this.importData = [...importData, ...this.importData]
            let filterData = serialCodeData.filter(items => !items.readonly && (items.startNumber || items.endNumber || items.actualQuantity || items.serialCodeSn))

            this.form.serialCodeData = [...this.importData, ...filterData]

            this.form.serialCodeData.map((items, index) => {
              items.number = ++index
            })
            this.serialFileName = res.data.fileTitle
            this.form.serialCodeItems.push(response.data.fileUploadVo)
            this.$Message.success('导入完成')

          })
        }

      },
      onerror(error, type) {
        this.$Message.error('上传失败')
      },
      onremove(index, type) {
        if(type === '回传单') {
          this.form.fileItems.splice(index, 1)
        }else {
          let removeItem = this.form.serialCodeItems.splice(index, 1)
          // console.log(removeItem[0].uid)
          this.form.serialCodeData = this.form.serialCodeData.filter(items => items.uid !== removeItem[0].uid)
          this.importData = this.importData.filter(items => items.uid !== removeItem[0].uid)
          this.form.serialCodeData.map((items, index) => {
            items.number = ++index
          })
          if(this.form.serialCodeData.length === 0 ) {
            this.addSerialData()
          }
        }
      },

      addSerialData() {
        this.form.serialCodeData.push({
          number: this.form.serialCodeData.length + 1,
          serialCodeSn: '',
          startNumber: null,
          endNumber: null,
          actualQuantity: null,
          readonly: false,
        })
      },

      removeSerialData(index) {
        this.form.serialCodeData.splice(index, 1)
      },

      endNumChange(index) {
        let {startNumber, endNumber} = this.form.serialCodeData[index]
        if(endNumber !== null) {
          if(startNumber > endNumber) return this.$Message.error('序列号结束值须大于起始值')
        }
      },

      submit() {

        this.$refs.form.validate(val => {
          if (!val) return
          this.submintLodaing = true
          let params = null

          if(this.id) {
            let serialCodeData = JSON.parse(JSON.stringify(this.form.serialCodeData))

            let editLgTheoretical = serialCodeData.some(items => items.startNumber > items.endNumber)

            if(editLgTheoretical) return this.$Message.error('序列号结束值须大于起始值')
            if(this.actualNumberTotal > (this.detailData.expectedOutboundNumber - this.detailData.remainNumTotal) ) return this.$Message.error('实际点货总量不能大于出库单剩余可出库量')
            params = {}

            params.data = serialCodeData.map(items => {
              return {
                id: items.id,
                serialCodeSn: items.serialCodeSn,
                startNumber: this.formatSerialCode(items.startNumber),
                endNumber: this.formatSerialCode(items.endNumber),
                actualQuantity: items.actualQuantity,
              }
            })

            this.$API.editOutbountRecord(params).then(res => {
              // console.log(res)
              if(res.code !== 0) return
              this.$Message.success(res.msg)
              this.$router.push('/outbound-management/CKSQ-outbound-application')

            }).finally(() => {
              this.submintLodaing = false
            })

            return
          }

          params = JSON.parse(JSON.stringify(this.form))
          let lgTheoretical = params.serialCodeData.some(items => items.startNumber > items.endNumber)

          if(lgTheoretical) return this.$Message.error('序列号结束值须大于起始值')
          if(this.form.fileItems.length === 0) return this.$Message.error('请上传出库回传单')
          if(this.actualNumberTotal > (this.detailData.expectedOutboundNumber - this.detailData.remainNumTotal) ) return this.$Message.error('实际点货总量不能大于出库单剩余可出库量')

          delete params.realName
          params.serialCodeData.forEach(items => {
            items.startNumber = this.formatSerialCode(items.startNumber)
            items.endNumber = this.formatSerialCode(items.endNumber)

            delete items.readonly
            items.uid && delete items.uid
          })
          !params.warehouseSn && delete params.warehouseSn
          if(!params.serialCodeItems.length > 0){
            delete params.serialCodeItems
          }else{
            params.serialCodeItems = params.serialCodeItems.forEach(items => {
              items.uid && delete items.uid
            })
          }
          params.fileItems = params.fileItems.map(items => {
            items.uid && delete items.uid
            return items
          })

          // return console.log(params)
          this.$API.outboundLsitManual(params).then(res => {
            // console.log(res)
            if(res.code !== 0) return
            this.$Message.success(res.msg)
            this.$router.push('/outbound-management/CKSQ-outbound-application')
          }).finally(() => {
            this.submintLodaing = false
          })

        })
      },

      getOutboundDetail(id) {
        this.spinShow = true
        this.$API.getOutboundLsitDetail(id).then(res => {
          // console.log(res)
          if (res.code !== 0) return
          this.spinShow = false
          for (let key in res.data) {
            this.detailData[key] = res.data[key]
          }
          this.form.fileItems = this.detailData.fileItems
          this.form.serialCodeItems = this.detailData.serialCodeItems
          this.detailData.reissueType = this.switchReiusseType(this.detailData.reissueType)
        })
      },

      getOutbountSerialData(id, type) {
        // this.spinShow = true
        let ids = []
        ids.push(id)
        this.$API.getOutbountSerialData({ids, type}).then(res => {
          if (res.code !== 0) return
          this.form.serialCodeData = res.data.map((items, index) => {
            items.number = ++index
            items.startNumber = Number(items.startNumber)
            items.endNumber = Number(items.endNumber)
            return items
          })
        })
      },

      getOutboundApplySnNum(id) {
        this.$API.getOutboundApplySnNum(id).then(res => {
          // console.log(res)
          if (res.code !== 0) return
          // 出库单剩余可出库量
          this.detailData.remainNumTotal = res.data[0]
        })
      },

      checkSerialcode(code) {
        this.$API.checkSerialcode(code).then(res => {
          // console.log(res)
          if (res.code !== 0) return
          // 验证序列号
          this.detailData.remainNumTotal = res.data[0]
        })
      },

      exportOutboundtemplate() {
        this.$API.exportOutboundtemplate({outboundOrderSn: this.detailData.outboundOrderSn}).then(res => {
          let data = res
          // console.log(res)
          if (typeof window.chrome !== 'undefined') {
            // Chrome version
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.click();
          } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE version
            window.navigator.msSaveBlob(data);
          } else {
            // Firefox version
            var file = new File([data], { type: 'application/force-download' });
            window.open(URL.createObjectURL(file));
          }
          this.$Message.success('模板导出成功')
        })
      },

      switchReiusseType(type) {
        switch (type) {
          case 'other' :
            return '其他'
            break;
          case 'loss' :
            return '补发'
            break;
          default:
            return '-'
        }
      },
      // 序列码格式 编号大写 + 8位数字
      formatSerialCode(num) {
        num = num + ''
        let zeroLength = 8 - num.length
        let fixZero = ''
        for(let i = 0; i < zeroLength; i++){
          fixZero += '0'
        }
        return fixZero + num
      },

    },
    computed: {
      // 实际点货量汇总
      actualNumberTotal() {
        // 汇总每个序列号实际点货量
        let serialCodeData = this.form.serialCodeData
        let total = serialCodeData.reduce((pre, cur) => {
          let actualQuantity = cur.actualQuantity || 0
          return Number(pre) + Number(actualQuantity)
        }, 0)
        // console.log(total)
        return total
      }
    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.outbound_apply_id = this.$route.query.outbound_apply_id
      this.form.outboundApplyId = this.outbound_apply_id
      this.type = this.$route.query.type
      this.form.realName = userInfo.realName || ''
      // console.log(this.id, 'id')
      // console.log(this.outbound_apply_id, 'outbound_apply_id')
      if(this.id) {
        this.getOutbountSerialData(this.id, this.type)
      }
      if(this.outbound_apply_id){
        this.getOutboundDetail(this.outbound_apply_id)
        this.getOutboundApplySnNum(this.outbound_apply_id)
      }
    }
  }
</script>

<style scoped>
  .necessary:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .upload-list-wrap {
    display: flex;
    position: relative;
    top: 4px
  }

  .upload-file {
    flex: 1;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    padding-left: 10px;
  }

  .upload-list {
    /*flex: 1;*/
    display: flex;
    /*align-items: center;*/
    padding: 3px 4px;
    margin-bottom: 3px;
  }

  .upload-list:hover, .serialdata:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    /*display: none;*/
    visibility: hidden;
  }

  .upload-list:hover .icon-trash {
    /*display: block;*/
    visibility: visible;
    cursor: pointer;
  }

  .serialdata {
    margin-top: 43px;

  }

  /deep/ .ivu-form-item-error-tip {
    font-size: 12px;
  }

</style>