<template>
  <div class="app-container">
    <div style="float: left; margin: 20px;" >
      <el-upload
        class="upload-demo"
        action="http://cmdb.tigerbrokers.net:8000/ips/uploadIps"
        :show-file-list= "false"
        :on-error="uploadError"
        :on-success="uploadSuccess">
        <el-button  type="primary" v-if="this.$store.getters.perms.indexOf('31l')>-1 || this.$store.getters.perms.indexOf('5')>-1 ">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件(文件格式遵循导出文件)</div>
      </el-upload>
    </div>
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true" v-if="this.$store.getters.perms.indexOf('31r')>-1  || this.$store.getters.perms.indexOf('5')>-1 ">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" v-if="this.$store.getters.perms.indexOf('31c')>-1 ||  this.$store.getters.perms.indexOf('5')>-1 ">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload" v-if="this.$store.getters.perms.indexOf('31l')>-1 || this.$store.getters.perms.indexOf('5')>-1 ">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="dialogMultiVisible=true" type="primary" icon="edit" v-if="this.$store.getters.perms.indexOf('31u')>-1  || this.$store.getters.perms.indexOf('5')>-1 ">批量修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="MultiDelete" type="primary"
                 icon="edit"v-if="this.$store.getters.perms.indexOf('31d')>-1 || this.$store.getters.perms.indexOf('5')>-1">批量删除
      </el-button>
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
        <!--prop="ips_id" sortable>-->
      <!--</el-table-column>-->
      <el-table-column
        label="网段"
        prop="ip_segment" sortable>
      </el-table-column>
      <el-table-column
        label="掩码"
        prop="netmask" sortable>
      </el-table-column>
      <el-table-column
        label="网关"
        prop="gateway" sortable>
      </el-table-column>
      <el-table-column
        label="运营商"
        prop="isp" sortable>
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city" sortable>
      </el-table-column>
      <el-table-column
        label="位置"
        prop="position" sortable>
      </el-table-column>
      <el-table-column
        label="修改者"
        prop="last_editor">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_date">
      </el-table-column>
      <el-table-column
        label="更新日期"
        prop="update_date">
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="perms.indexOf('31u')>-1  ||  perms.indexOf('5')>-1 "
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="perms.indexOf('31d')>-1 ||  perms.indexOf('5')>-1 "
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--新增-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogNewVisible">
      <el-form :model="ctemp" status-icon :rules="rules" ref="ctemp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="ip地址段" :label-width="formLabelWidth" prop="ip_segment">
          <el-input v-model="ctemp.ip_segment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="ctemp.netmask" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="ctemp.gateway" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="isp">
          <el-input v-model="ctemp.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="city" >
          <el-input v-model="ctemp.city" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="postion" >
          <el-input v-model="ctemp.position" auto-complete="off" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!--editdialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="ip地址段" :label-width="formLabelWidth" prop="ip_segment">
          <el-input v-model="temp.ip_segment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="temp.netmask" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.gateway" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.city" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.position" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMultiVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="ip地址段" :label-width="formLabelWidth" prop="ip_segment">
          <el-input v-model="temp.ip_segment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="temp.netmask" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.gateway" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.city" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="temp.position" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMultiVisible = false">取 消</el-button>
        <el-button type="primary" @click="MultiUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible">
      <el-form :model="listQuery" status-icon  ref="listQuery" label-width="100px" class="demo-ruleForm">
        <el-form-item label="ip地址段" :label-width="formLabelWidth" prop="ip_segment">
          <el-input v-model="listQuery.ip_segment" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="listQuery.netmask" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.gateway" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.city" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.position" auto-complete="off" ></el-input>
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

  export default {

    data() {
      var selectList = new Set();
      var reg=/^(\d{1,3})(\.(\d{1,3})){3}$/
      var checkEmpty = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('输入不能为空'))
        }else{
          callback()
        }
      }
      var checkAddress = (rule, value, callback) =>{

        if (!value) {
          return callback(new Error('输入不能为空'))
        }
        if(!reg.test(value)){
          callback(new Error('请填写正确的ip地址'))
        }else{
          callback()
        }

      }
      return {
        formLabelWidth: '120px',
        list: null,
        wholeList:null,
        total: null,
        row:null,
        listLoading: true,
        defalutQuery:{
          page: 1,
          pagesize: 20
        },
        listQuery: {
          ips_id:"",
          ip_segment: "",
          netmask: "",
          gateway: "",
          isp:"",
          city:"",
          position:"",
          create_date:"",
          last_editor: "",
          update_date: "",
          page: 1,
          pagesize: 20

        },
        //edit temp
        temp: {
          ips_id:"",
          ip_segment: "",
          netmask: "",
          gateway: "",
          isp:"",
          city:"",
          position:"",
          create_date:"",
          last_editor: "",
          update_date: "",
        },
        //create temp without idc_id
        ctemp: {
          ip_segment: "",
          netmask: "",
          gateway: "",
          isp:"",
          city:"",
          position:"",
          create_date:"",
          last_editor: "",
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
        //use to transfer single idc_id to list [x]
        transferSelect: [],
        setList: selectList,

        rules: {
          ip_segment: [{validator: checkAddress, trigger: 'blur'}],
          netmask: [{validator: checkAddress, trigger: 'blur'}],
          gateway: [{validator: checkAddress, trigger: 'blur'}],
          isp:[{validator: checkEmpty, trigger:'blur'}],
          city:[{validator:checkEmpty,trigger:'blur'}]

        }

      }
    },
    created() {
      this.getList()
      console.log('geting list..')
    },
    mounted() {

      var dialog = document.querySelectorAll('div.el-dialog')
      dialog.forEach(function (value,index,array) {
        value.onmousedown = function(ev) {
          var oevent = ev || event;

          var distanceX = oevent.clientX - value.offsetLeft;
          var distanceY = oevent.clientY - value.offsetTop;

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


    },
    computed:{
      perms(){
        return this.$store.getters.perms
      }
    },
    methods:{
      getList(){
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/ips/getAll',{params:this.listQuery}).then(response=>{
          console.log(response.data);
          console.log(this.listQuery)
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err)=> {
          console.log(err)
        })


      },
      handleIconClick() {
        this.dialogSearchVisible = false
        this.listLoading =  true
        axios.post('http://cmdb.tigerbrokers.net:8000/ips/searchIps',this.listQuery).then(response => {
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
          this.$refs.listQuery.resetFields()

        }).catch((err) => {
          console.log(err)
          this.listLoading =  false
        })


      },
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleEdit(index,row){
        var date = new Date()
        this.dialogStatus = 'edit'
        console.log(row)
        this.temp = Object.assign({}, row)
        this.transferSelect.splice(0,1,row.ips_id)
        this.temp.ips_id = this.transferSelect
        console.log(this.$store.getters.username)
        this.temp.last_editor = this.$store.getters.username
        this.temp.update_date = this.transferDate(date)
        console.log(this.temp)
        this.dialogFormVisible = true
        this.row = row
      },
      handleDelete(index,row){
        console.log(row)
        axios.post('http://cmdb.tigerbrokers.net:8000/ips/deleteIps', {ips_id: [row.ips_id]}).then(response => {
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
      },
      handleCreate(){
        var date = new Date()
        this.dialogStatus = 'create'
        this.dialogNewVisible = true
        var time = this.transferDate(date)
        this.ctemp.create_date = time
        this.ctemp.update_date = time

        this.ctemp.last_editor = this.$store.getters.username
        console.log(this.ctemp)
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['网段', '掩码', '网关', '运营商','城市','位置','修改者','创建时间','更新日期']
          const filterVal = [ 'ip_segment', 'netmask', 'gateway', 'isp','city','position','last_editor','create_date','update_date']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, 'ips数据')
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
        this.setList.forEach((item, i) => {

          this.multipleSelection.push(item.ips_id);

        })
      },
      update(){
        axios.post('http://cmdb.tigerbrokers.net:8000/ips/editIps', this.temp).then(response => {
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
          const index = this.list.indexOf(this.row)
          console.log(index,this.list, this.temp,this.row)
          this.list.splice(index,1,this.temp)
        }).catch(function (error) {
          console.log(error)
        })
      },
      //批量修改
      MultiUpdate() {
        var date = new Date()
        this.dialogStatus = 'MultiEdit'


        this.dialogMultiVisible = true

        this.temp.update_date = this.transferDate(date)
        this.temp.ips_id = this.multipleSelection

        console.log(this.temp)
        axios.post('http://cmdb.tigerbrokers.net:8000/ips/editIps', this.temp).then(response => {
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
      //新建
      create() {
        this.$refs.ctemp.validate((valid)=>{
          if(valid){

            axios.post('http://cmdb.tigerbrokers.net:8000/ips/addIps', this.ctemp
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
      //批量删除
      MultiDelete() {
        this.multipleSelection = []
        this.setList.forEach((item, i) => {

          this.multipleSelection.push(item.ips_id);

        })
        axios.post('http://cmdb.tigerbrokers.net:8000/ips/deleteIps', {ips_id: this.multipleSelection}).then(response => {
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

    }
  }
</script>
