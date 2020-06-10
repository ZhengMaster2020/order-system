<template>
  <div>
  <Card>
    <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
      <Button type="primary" >确认提交</Button>
    </Row>

    <Form :model="form" ref="form" inline :rules="rules">
      <Row class="margin-bottom-10 title">
        <Col>
          基础信息
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="申请人" style="width: 100%">
            <Input v-model="detailData.created_by" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="申请时间" style="width: 100%">
            <Input v-model="detailData.created_at" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="入库单号" style="width: 100%">
            <Input v-model="detailData.storage_number" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="下单编号" style="width: 100%">
            <Input v-model="detailData.supplier_order_number" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="订单数量" style="width: 100%">
            <Input v-model="detailData.amount" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="剩余可入库量" style="width: 100%">
            <Input v-model="detailData.remain_number" readonly/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="4">
          <FormItem label="下单时间" style="width: 100%">
            <Input v-model="detailData.order_time" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="生产供应商" style="width: 100%">
            <Input v-model="detailData.supplier" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="包材名称" style="width: 100%">
            <Input v-model="detailData.packing" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="类型" style="width: 100%">
            <Input v-model="detailData.packing_type" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="本次预计入库量" style="width: 100%">
            <Input v-model="detailData.expected_quantity" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="入库仓位号" style="width: 100%">
            <Input v-model="detailData.position_number" readonly/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="备注" style="width: 100%">
            <Input v-model="detailData.remark" readonly/>
          </FormItem>
        </Col>
        <Col :span="isManualStorage ? 12 : 4">
          <FormItem label="送货单文件" style="width: 100%">
<!--            <Input v-model="detailData.reissueType" readonly/>-->
            <div style="padding-top: 33px; margin-top: 1px">
<!--              <a :href="file.url" :download="file.name" class="download-link"-->
<!--                 v-for="(file, index) in detailData.delivery_file"-->
<!--                 :key="index">{{file.name}}</a>-->
              <a href="#">送货单文件</a>
            </div>
          </FormItem>
        </Col>
        <Col span="4" v-if="!isManualStorage">
          <FormItem label="剩余可入库量" style="width: 100%">
            <Input v-model="detailData.reissueType" readonly/>
          </FormItem>
        </Col>
      </Row>


      <Row class="margin-bottom-10">
        <Col >
          <span class="title">{{subTitle}}</span>
          <a style="font-size: 12px" href="javascript:void(0)" @click="toStorageRecord" v-if="isManualStorage">&nbsp;&nbsp;&nbsp;查看入库记录</a>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="入库员" style="width: 100%">
            <Input v-model="userInfo.realName" readonly/>
          </FormItem>
        </Col>
        <Col span="4" v-if="isManualStorage">
          <FormItem label="入库单剩余可入库量" style="width: 100%">
            <Input v-model="actualNumberTotal" readonly/>
          </FormItem>
        </Col>
        <Col span="8" v-if="isManualStorage">
          <div class="upload-list-wrap">
            <div>
              <div class="necessary margin-bottom-10 font-size-12">上传装箱单</div>
              <Upload
              ref="upload"
              :format="['jpg','jpeg','png']"
              :show-upload-list="false"
              :action="fileUploadURL"
              :headers="fileUploadHeaders"
              :default-file-list="form.fileItems"
              :on-format-error="(file) => onFormatError(file, '回传单')"
              :before-upload="(file) => beforeUpload(file, '回传单')"
              :on-success="(response) => onsuccess(response, '回传单')"
              :on-error="(error) => onerror(error, '回传单')"
              >
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
              </Upload>
            </div>
            <div class="upload-file">
              <div class="upload-list" v-for="(file, index) in form.boxItems" :key="index">
<!--                <a href="javascript:void(0)" class="download-link" >{{file.name.substring(0, file.name.lastIndexOf('.'))}}</a>-->
                                  <a href="javascript:void(0)" class="download-link">{{file.name.substring(0, file.name.lastIndexOf('.'))}}</a>
                <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index, '回传单')"/>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <!--   TODO： for batchData     -->
      <Row v-for="(serial, index) in this.form.batchData" :key="index">
        <Col span="2" v-if="isManualStorage">
          <FormItem :label="index === 0? '序号' : ''" style="width: 100%">
            <Input v-model="serial.number" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="index === 0? '生产批次号' : ''" style="width: 100%" :prop="'batchData.' + index + '.batchNumber'" :rules="rules.batchNumber">
<!--            <Input v-model="serial.batchNumber" :readonly="serial.readonly"/>-->
            <Select  v-model="serial.batchNumber">
              <Option v-for="(items, index) in batchList" :key="index" :value="items.value" :label="items.lang" />
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="index === 0? '所属计划名称' : ''" style="width: 100%">
            <Input v-model="serial.number" readonly/>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label="index === 0? '标类型' : ''" style="width: 100%">
            <Input v-model="serial.number" readonly/>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem :label="index === 0? '生产数量' : ''" style="width: 100%">
            <Input v-model="serial.number" readonly/>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem :label="index === 0? '剩余可入库量' : ''" style="width: 100%">
            <Input v-model="serial.number" readonly/>
          </FormItem>
        </Col>
        <Col span="3" v-show="isManualStorage">
          <FormItem :label="index === 0? '本次入库数量' : ''" style="width: 100%">
            <Input v-model="serial.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-show="!isManualStorage">
          <FormItem :label="index === 0? '已实际入库量' : ''" style="width: 100%">
            <Input v-model="serial.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-show="!isManualStorage">
          <FormItem :label="index === 0? '修改本次入库数量' : ''" style="width: 100%">
            <Input v-model="serial.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-if="isManualStorage">
          <FormItem :label="index === 0? ' ' : ''" :class="index === 0 ? 'endNumStyle' : ''">
            <Button shape="circle" icon="md-add"  v-if="index === 0"></Button>
            <Button shape="circle" icon="md-remove"  v-if="index !== 0 && !serial.readonly"></Button>
          </FormItem>
        </Col>
      </Row>

      <!--        TODO: 修改是隐藏-->
      <Row class="margin-top-10" v-if="isManualStorage">
        <Col span="2" offset="16"  style=" text-align: right; padding-top: 10px"> 总计 </Col>
        <Col span="3"><Input v-model="actualNumberTotal" readonly/></Col>
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
        spinShow: false,
        subTitle: '手动入库',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        // serialCodeDataURL: `${SERVER_BASE_URL}traceability/outbound-apply/data-import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        userInfo: {},
        batchList: [],
        form: {
          id: null,
          boxItems: [],
          batchData: [
            {
              batchNumber: null,
              currentQuantity: null,
              batchList: [],
            }
          ],
        },
        detailData: {
          detailData: [],
          batchData: [],
        },
        rules: {
          batchNumber: [{required: true, message: '须大写字母', trigger: 'blur'}],
          currentQuantity: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
        },

      }
    },
    methods: {

      toStorageRecord() {
        this.$router.push({
          path: '/storage-management/storage-application',
          tab: 'record'
        })
      },

      beforeUpload(file) {

      },
      onFormatError(response, type) {
        if(type === '回传单') {
          this.$Message.error('请按图片格式上传:".jsp, .png, .jpeg"')
        }else {
          this.$Message.error('请按excel文件格式上传')
        }
      },
      onsuccess(response) {
        if (response.code === 0) {
          this.$Message.success(response.msg)
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

      // 详情
      getStorageDetail(id) {
        this.spinShow = true
        // this.$API.getStorageDetail(id).then(res => {
        //   console.log(res)
        //   this.spinShow = false
        // })
      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      if(this.id) {
        this.subTitle = '修改入库记录'
        // this.getStorageDetail(this.id)
      }
    },
    computed: {
      // 实际点货量汇总
      actualNumberTotal() {
        // 汇总每个序列号实际点货量
        let batchData = this.form.batchData
        let total = batchData.reduce((pre, cur) => {
          let actualQuantity = cur.actualQuantity || 0
          return Number(pre) + Number(actualQuantity)
        }, 0)
        // console.log(total)
        return total
      },
      isManualStorage() {
        return this.subTitle === '手动入库'
      }
    },

  }
</script>

<style scoped>
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
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    visibility: hidden;
  }

  .upload-list:hover .icon-trash {
    visibility: visible;
    cursor: pointer;
  }

  .endNumStyle {
    width: 100%;
    padding-top: 34px;
  }

</style>