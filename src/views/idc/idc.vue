<template>
  <div class="app-container">
    <div style="float: left; margin: 20px;" >
      <el-upload
        class="upload-demo"
        action="http://cmdb.tigerbrokers.net:8000/idcs/uploadIdc"
        :show-file-list= "false"
        :on-error="uploadError"
        :on-success="uploadSuccess">
        <el-button  type="primary" v-if="this.$store.getters.perms.indexOf('4l')>-1 || this.$store.getters.perms.indexOf('5')>-1">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件(文件格式遵循导出文件)</div>
      </el-upload>
    </div>
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true" v-if="this.$store.getters.perms.indexOf('4r')>-1 || this.$store.getters.perms.indexOf('5')>-1">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" v-if="this.$store.getters.perms.indexOf('4u')>-1 || this.$store.getters.perms.indexOf('5')>-1">添加
      </el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload" v-if="this.$store.getters.perms.indexOf('4l')>-1 || this.$store.getters.perms.indexOf('5')>-1">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="dialogMultiVisible=true" type="primary"
                 icon="edit"v-if="this.$store.getters.perms.indexOf('4u')>-1 || this.$store.getters.perms.indexOf('5')>-1">批量修改
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="MultiDelete" type="primary"
                 icon="edit"v-if="this.$store.getters.perms.indexOf('4d')>-1 || this.$store.getters.perms.indexOf('5')>-1">批量删除
      </el-button>

      <!--<el-button class="filter-item" style="margin-left: 10px;" @click="MultiDelete" type="danger"-->
                 <!--icon="edit">批量删除-->
      <!--</el-button>-->
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="need some time"
      border fit highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="35">
      </el-table-column>
      <!--<el-table-column-->
        <!--label="ID"-->
        <!--prop="idc_id"-->
        <!--min-width="85">-->
      <!--</el-table-column>-->
      <el-table-column
        label="运营商"
        prop="isp"
        sortable>
      </el-table-column>
      <el-table-column
        label="线路"
        prop="line"
        sortable>
      </el-table-column>
      <el-table-column
        label="带宽"
        prop="bandwidth"
        sortable>
      </el-table-column>
      <el-table-column
        label="机柜数"
        prop="racks"
        sortable>
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city"
        sortable>
      </el-table-column>
      <el-table-column
        label="位置"
        prop="position"
        sortable>
      </el-table-column>
      <el-table-column
        label="报障电话"
        prop="telephone"
        sortable>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        sortable>
        <template scope="scope">
          {{scope.row.status | idcV}}
        </template>
      </el-table-column>
      <el-table-column
        label="修改者"
        prop="last_editor">
      </el-table-column>
      <el-table-column
        label="创建日期"
        prop="create_date">
      </el-table-column>
      <el-table-column
        label="更新日期"
        prop="update_date">
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button  v-if="perms.indexOf('4u')>-1 || perms.indexOf('5')>-1"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button  v-if="perms.indexOf('4d')>-1 || perms.indexOf('5')>-1"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>



    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--新增-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogNewVisible" width="550px">
      <el-form :model="ctemp" status-icon :rules="rules" ref="ctemp" label-width="100px" class="demo-ruleForm">
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="isp">
          <el-input v-model="ctemp.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路" :label-width="formLabelWidth" prop="line">
          <el-input v-model="ctemp.line" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="带宽" :label-width="formLabelWidth" prop="bandwidth">
          <el-input v-model="ctemp.bandwidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机柜数" :label-width="formLabelWidth" prop="racks">
          <el-input v-model.number="ctemp.racks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="city">
          <el-input v-model="ctemp.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="position">
          <el-input v-model="ctemp.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="ctemp.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="ctemp.status" placeholder="请选择状态">
            <el-option label="已使用" value=0></el-option>
            <el-option label="未使用" value=1></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!--editdialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="temp">
        <el-form-item label="运营商" :label-width="formLabelWidth">
          <el-input v-model="temp.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路" :label-width="formLabelWidth">
          <el-input v-model="temp.line" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="带宽" :label-width="formLabelWidth">
          <el-input v-model="temp.bandwidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机柜数" :label-width="formLabelWidth">
          <el-input v-model="temp.racks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="temp.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-input v-model="temp.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="temp.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">

          <el-select v-model="temp.status " placeholder="请选择状态" @change="changeValue">

            <el-option label="已使用" value=0></el-option>
            <el-option label="未使用" value=1></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMultiVisible" width="550px">
      <el-form :model="temp">
        <el-form-item label="运营商" :label-width="formLabelWidth">
          <el-input v-model="temp.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路" :label-width="formLabelWidth">
          <el-input v-model="temp.line" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="带宽" :label-width="formLabelWidth">
          <el-input v-model="temp.bandwidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机柜数" :label-width="formLabelWidth">
          <el-input v-model="temp.racks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="temp.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-input v-model="temp.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="temp.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option label="已使用" value=0></el-option>
            <el-option label="未使用" value=1></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMultiVisible = false">取 消</el-button>
        <el-button type="primary" @click="MultiUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible" width="550px">
      <el-form :model="listQuery">
        <el-form-item label="运营商" :label-width="formLabelWidth">
          <el-input v-model="listQuery.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="线路" :label-width="formLabelWidth">
          <el-input v-model="listQuery.line" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="带宽" :label-width="formLabelWidth">
          <el-input v-model="listQuery.bandwidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机柜数" :label-width="formLabelWidth">
          <el-input v-model="listQuery.racks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="listQuery.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth">
          <el-input v-model="listQuery.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="listQuery.telephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="已使用" value=0></el-option>
            <el-option label="未使用" value=1></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">退出</el-button>
        <el-button type="primary" @click="handleIconClick">搜索</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }


</style>

<script>
  import axios from 'axios'
  import {parseTime} from '@/utils'
  import {move} from '@/utils/drag'


  window.onload = move
  export default {

    data() {
      var selectList = new Set();
      var checkEmpty = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('输入不能为空'))
        }else{
          callback()
        }
      }

      var checkRack = (rule, value, callback) => {
        console.log(value)
        console.log(typeof (value))
        if (!value) {
          return callback(new Error('输入不能为空'))
        }
        setTimeout(() => {
          console.log(Number.isInteger(value))
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000)
      }

      return {
        formLabelWidth: '120px',
        list: null,
        wholeList:null,
        total: null,
        listLoading: true,
        row:null,
        defalutQuery:{
          page: 1,
          pagesize: 20
        },
        listQuery: {
          bandwidth: "",
          city: "",
          create_date: "",
          isp: "",
          last_editor: "",
          line: "",
          position: "",
          racks: "",
          status: "",
          telephone: "",
          page: 1,
          pagesize: 20

        },
        //edit temp
        temp: {
          idc_id: "",
          bandwidth: "",
          city: "",
          create_date: "",
          isp: "",
          last_editor: "",
          line: "",
          position: "",
          racks: "",
          status: "",
          telephone: "",
          update_date: "",
        },
        //create temp without idc_id
        ctemp: {
          bandwidth: "",
          city: "",
          create_date: "",
          isp: "",
          last_editor: "",
          line: "",
          position: "",
          racks: "",
          status: "",
          telephone: "",
          update_date: "",
        },
        textMap: {
          edit: 'Edit',
          create: 'Create',
          MultiEdit: 'Multi Edit'

        },
        dialogNewVisible: false,
        dialogFormVisible: false,
        dialogMultiVisible: false,
        dialogSearchVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        rowSelection:[],
        //use to transfer single idc_id to list [x]
        transferSelect: [],
        setList: selectList,

        rules: {
          isp: [{validator: checkEmpty, trigger: 'blur'}],
          line: [{validator: checkEmpty, trigger: 'blur'}],
          bandwidth: [{validator: checkEmpty, trigger: 'blur'}],
          racks: [{validator: checkRack, trigger: 'blur'}],
          city: [{validator: checkEmpty, trigger: 'blur'}],
          position: [{validator: checkEmpty, trigger: 'blur'}],
          telephone: [{validator: checkEmpty, trigger: 'blur'}],
          status:[{validator: checkEmpty, trigger:'blur'}]
        }

      }
    },
    created() {
      this.getList()
      console.log('geting list..')

    },
    computed:{
      filterMessage: {

        get:function () {
          return this.temp.status
        },
        set:function (val) {

          if (val==0){
            this.temp.status = '已使用'
          }
          if (val==1){
            this.temp.status ='未使用'
          }

        }


      },
      reverseMessage:{
        get:function(){
          return this.temp.status
          console.log(this.temp.status)
        },
        set:function(val){
          console.log(val)
          if(val.indexOf('已使用')>-1){
            this.temp.status= 0
            console.log(11111)
          }
          if(val.indexOf('未使用')>-1){
            this.temp.status = 1
          }
        }
      },
      perms(){
        return this.$store.getters.perms
      }
    },
    mounted() {

      var dialog = document.querySelectorAll('div.el-dialog')
      dialog.forEach(function (value,index,array) {
        value.onmousedown = function(ev) {
          var oevent = ev || event;


          var distanceX = oevent.clientX - value.offsetLeft;
          var distanceY = oevent.clientY - value.offsetTop;
          console.log('%c%s%s%s%s%s%s%s%s','color:Red','Y:',distanceY,'X:',distanceX,'offsetL:',value.offsetLeft,'offsetT:',value.offsetTop)
          document.onmousemove = function (ev) {
            var oevent = ev || event;
            value.style.left = oevent.clientX - distanceX + 'px';
            value.style.top = oevent.clientY - distanceY + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      })


    }
    ,
    methods: {
      getList() {
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/idcs/getAll', {params: this.listQuery}).then(response => {
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err) => {
          console.log(err)
        })



      },
      handleIconClick() {
        this.dialogSearchVisible = false
        this.listLoading =  true
        axios.post('http://cmdb.tigerbrokers.net:8000/idcs/searchIdc',this.listQuery).then(response => {
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
          if(response.data.code=='20000'){
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 5000
            })
          }else{
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 5000
            })
          }

        }).catch((err) => {
          console.log(err)
          this.listLoading =  false
        })

      },
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        if(Object.keys(this.listQuery).length>2){
          axios.post('http://cmdb.tigerbrokers.net:8000/idcs/searchIdc',this.listQuery).then(response => {
            console.log(response.data);
            this.list = response.data.data
            console.log(response.data.total)
            this.total = response.data.total[0].total
            this.listLoading = false


          }).catch((err) => {
            console.log(err)
            this.listLoading =  false
          })
        }else {
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if(Object.keys(this.listQuery).length>2){
          axios.post('http://cmdb.tigerbrokers.net:8000/idcs/searchIdc',this.listQuery).then(response => {
            console.log(response.data);
            this.list = response.data.data
            console.log(response.data.total)
            this.total = response.data.total[0].total
            this.listLoading = false


          }).catch((err) => {
            console.log(err)
            this.listLoading =  false
          })
        }else {
          this.getList()
        }
      },
      handleEdit(index, row) {
        var date = new Date()
        this.dialogStatus = 'edit'
        console.log(row)
        this.temp = Object.assign({}, row)

        this.transferSelect.splice(0,1,row.idc_id)

        this.temp.idc_id = this.transferSelect
        this.filterMessage = this.temp.status
        console.log(this.$store.getters.username)
        this.temp.last_editor = this.$store.getters.username
        this.temp.update_date = this.transferDate(date)
        console.log(this.temp)
        this.dialogFormVisible = true
        this.row=  row

      },
      //先确认
      handleDelete(index, row) {
        console.log(row)
        const h = this.$createElement;
        this.$msgbox({
          title: '删除',
          message: h('p', null, [
            h('span', null, '删除此条记录？'),
            h('i', { style: 'color: red' })
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',

        }).then(action => {
          axios.post('http://cmdb.tigerbrokers.net:8000/idcs/deleteIdc', {idc_id: [row.idc_id]}).then(response => {
            console.log(response.data);
            if(response.data.code=='20000'){
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 5000
              })
            }else{
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'warning',
                duration: 5000
              })
            }
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }).catch(error => {
          })
        });





      },
      handleCreate() {
//        this.ctemp = {}
        var date = new Date()
        this.dialogStatus = 'create'
        this.dialogNewVisible = true
        var time = this.transferDate(date)
        this.ctemp.create_date = time
        this.ctemp.update_date = time

        this.ctemp.last_editor = this.$store.getters.username
        console.log(this.ctemp)
      },
      //下载
      handleDownload() {
        axios.get('http://cmdb.tigerbrokers.net:8000/idcs/downloadIdc').then(response=>{
          console.log(response.data);
          this.wholeList= response.data.data
          require.ensure([], () => {
            const {export_json_to_excel} = require('@/vendor/Export2Excel')
            const tHeader = [ '运营商', '线路', '带宽', '机柜数','城市','位置','报障电话','状态','修改者','创建日期','更新日期']
            const filterVal = ['isp', 'line', 'bandwidth', 'racks','city','position','telephone','status','last_editor','create_date','update_date']
            const data = this.formatJson(filterVal, this.wholeList)
            export_json_to_excel(tHeader, data, 'idc数据')
          })
        }).catch((err)=> {
          console.log(err)
        })


      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      transferDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
      },
      //temp value of multiple selection
      handleSelectionChange(val) {

        this.setList = val
        console.log(this.setList)
        this.temp = Object.assign({}, val[0])

        console.log(this.multipleSelection)
      },
      //修改
      update() {

        this.reverseMessage = this.temp.status
        console.log(this.reverseMessage)
        axios.post('http://cmdb.tigerbrokers.net:8000/idcs/editIdc', this.temp).then(response => {
          console.log(response)
          this.dialogFormVisible = false
          if(response.data.code=='20000'){
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 5000
            })
          }else{
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 5000
            })
          }
//          this.getList()

          const index = this.list.indexOf(this.row)
          console.log(index,this.list, this.temp,this.row)
          this.list.splice(index,1,this.temp)
        }).catch(function (error) {
          console.log(error)
        })
      },
      //批量修改
      MultiUpdate() {
        this.multipleSelection = []
        this.setList.forEach((item, i) => {

          this.multipleSelection.push(item.idc_id);

        })
        var date = new Date()
        this.dialogStatus = 'MultiEdit'


        this.dialogMultiVisible = true

        this.temp.update_date = this.transferDate(date)
        this.temp.idc_id = this.multipleSelection
        this.reverseMessage=this.temp.status
        console.log(this.temp)
        axios.post('http://cmdb.tigerbrokers.net:8000/idcs/editIdc', this.temp).then(response => {
          console.log(response.data);
          if(response.data.code=='20000'){
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 5000
            })
          }else{
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 5000
            })
          }
          this.dialogMultiVisible = false
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      },
      //批量删除
      MultiDelete() {
        this.multipleSelection = []
        this.setList.forEach((item, i) => {

          this.multipleSelection.push(item.idc_id);

        })
        axios.post('http://cmdb.tigerbrokers.net:8000/idcs/deleteIdc', {idc_id: this.multipleSelection}).then(response => {
          console.log(response.data);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000

          })
          this.getList()
//          const index = this.list.indexOf(row)
//          this.list.splice(index, 1)
        }).catch(error => {
        })
      },
      //新增
      create() {

        this.$refs.ctemp.validate((valid)=>{

          if(valid){
            axios.post('http://cmdb.tigerbrokers.net:8000/idcs/addIdc', this.ctemp
            ).then(response => {
              console.log(response)

              this.dialogNewVisible = false
              if(response.data.code=='20000'){
                this.$notify({
                  title: '成功',
                  message: response.data.msg,
                  type: 'success',
                  duration: 5000
                })
              }else{
                this.$notify({
                  title: '失败',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 5000
                })
              }
              this.$refs.ctemp.resetFields()
              this.getList()

            }).catch(function (error) {
              console.log(error)
            })

          }else{

            alert('Can not submit')
          }
        })


      },
      //上传文件
      uploadError(){
        this.$notify({
          title: '失败',
          message: '上传失败',
          type: 'warning',
          duration: 5000

        })
      },
      //上传成功后判断 是否录入
      uploadSuccess(response,file,fileList) {

        console.log(response)
        if (response.code == '50000') {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 5000

          })
        }
        else {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 5000

          })
          this.getList()

        }
      },
      changeValue(value){
        console.log(value);
      }


    }

  }
</script>
