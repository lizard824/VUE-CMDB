<template>
  <div class="app-container">
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="dialogMultiVisible=true" type="primary" icon="edit">批量修改</el-button>
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="need some time"
      border fit highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="虚拟IP">
              <span>{{ scope.row.vip }}</span>
            </el-form-item>
            <el-form-item label="开发者">
              <span>{{ scope.row.dev_owner }}</span>
            </el-form-item>
            <el-form-item label="配置">
              <span>{{ scope.row.config }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ scope.row.create_date }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ scope.row.update_date }}</span>
            </el-form-item>
            <el-form-item label="修改者">
              <span>{{ scope.row.last_editor }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="35">
      </el-table-column>
      <!--<el-table-column-->
        <!--label="id"-->
        <!--prop="id" sortable>-->
      <!--</el-table-column>-->
      <el-table-column
        label="厂商"
        prop="oem" sortable>
      </el-table-column>
      <el-table-column
        label="型号"
        prop="model" sortable>
      </el-table-column>
      <el-table-column
        label="机房"
        prop="isp" sortable>
      </el-table-column>
      <el-table-column
        label="老虎资产"
        prop="lhzq_sn" sortable>
      </el-table-column>
      <el-table-column
        label="外网地址"
        prop="ip1" sortable>
      </el-table-column>
      <el-table-column
        label="内网地址"
        prop="ip2" sortable>
      </el-table-column>

      <el-table-column
        label="操作系统"
        prop="os">
      </el-table-column>
      <el-table-column
        label="业务主类"
        prop="main">
      </el-table-column>
      <el-table-column
        label="业务子类"
        prop="sub1">
      </el-table-column>
      <el-table-column
        label="业务子类"
        prop="sub2">
      </el-table-column>
      <el-table-column
        label="版本"
        prop="app_version">
      </el-table-column>
      <el-table-column
        label="端口"
        prop="app_port">
      </el-table-column>
      <el-table-column
        label="属性"
        prop="flag">
        <template scope="scope">
          {{scope.row.flag |flagV}}
        </template>
      </el-table-column>
      <el-table-column
        label="运维者"
        prop="op_owner">
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
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

        <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
          <el-input v-model="ctemp.app_port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
          <el-input v-model="ctemp.app_version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config">
          <el-input v-model="ctemp.config" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
          <el-input v-model="ctemp.dev_owner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="ctemp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="ctemp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="ctemp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
          <el-input v-model="ctemp.lhzq_sn" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
          <el-input v-model="ctemp.main" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="ctemp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
          <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="ctemp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
          <el-input v-model="ctemp.op_owner" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
          <el-input v-model="ctemp.os" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
          <el-input v-model="ctemp.sub1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
          <el-input v-model="ctemp.sub2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
          <el-input v-model="ctemp.vip" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="flag">
          <el-select v-model="ctemp.flag" placeholder="请选择状态">
            <el-option label="线上" value=1></el-option>
            <el-option label="测试" value=2></el-option>
            <el-option label="开发" value=3></el-option>
            <el-option label="备机" value=4></el-option>
            <el-option label="下线" value=5></el-option>
            <el-option label="故障" value=6></el-option>
          </el-select>
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


        <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
          <el-input v-model="temp.app_port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
          <el-input v-model="temp.app_version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config">
          <el-input v-model="temp.config" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
          <el-input v-model="temp.dev_owner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="temp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="temp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="temp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
          <el-input v-model="temp.lhzq_sn" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
          <el-input v-model="temp.main" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="temp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
        <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="temp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
          <el-input v-model="temp.op_owner" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
          <el-input v-model="temp.os" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
          <el-input v-model="temp.sub1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
          <el-input v-model="temp.sub2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
          <el-input v-model="temp.vip" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="flag">
          <el-select v-model="temp.flag" placeholder="请选择状态">
            <el-option label="线上" value=1></el-option>
            <el-option label="测试" value=2></el-option>
            <el-option label="开发" value=3></el-option>
            <el-option label="备机" value=4></el-option>
            <el-option label="下线" value=5></el-option>
            <el-option label="故障" value=6></el-option>
          </el-select>
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


        <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
          <el-input v-model="temp.app_port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
          <el-input v-model="temp.app_version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config">
          <el-input v-model="temp.config" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
          <el-input v-model="temp.dev_owner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="temp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="temp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="temp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
          <el-input v-model="temp.lhzq_sn" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
          <el-input v-model="temp.main" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="temp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
        <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="temp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
          <el-input v-model="temp.op_owner" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
          <el-input v-model="temp.os" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
          <el-input v-model="temp.sub1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
          <el-input v-model="temp.sub2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
          <el-input v-model="temp.vip" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="flag">
          <el-select v-model="ctemp.flag" placeholder="请选择状态">
            <el-option label="线上" value=1></el-option>
            <el-option label="测试" value=2></el-option>
            <el-option label="开发" value=3></el-option>
            <el-option label="备机" value=4></el-option>
            <el-option label="下线" value=5></el-option>
            <el-option label="故障" value=6></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMultiVisible = false">取 消</el-button>
        <el-button type="primary" @click="MultiUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible">
      <el-form :model="listQuery" status-icon :rules="rules" ref="listQuery" label-width="100px" class="demo-ruleForm">

        <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
          <el-input v-model="listQuery.app_port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
          <el-input v-model="listQuery.app_version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config">
          <el-input v-model="listQuery.config" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
          <el-input v-model="listQuery.dev_owner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="listQuery.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="listQuery.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="listQuery.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
          <el-input v-model="listQuery.lhzq_sn" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
          <el-input v-model="listQuery.main" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="listQuery.model" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
        <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="listQuery.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
          <el-input v-model="listQuery.op_owner" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
          <el-input v-model="listQuery.os" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
          <el-input v-model="listQuery.sub1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
          <el-input v-model="listQuery.sub2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
          <el-input v-model="listQuery.vip" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="flag">
          <el-select v-model="ctemp.flag" placeholder="请选择状态">
            <el-option label="线上" value=1></el-option>
            <el-option label="测试" value=2></el-option>
            <el-option label="开发" value=3></el-option>
            <el-option label="备机" value=4></el-option>
            <el-option label="下线" value=5></el-option>
            <el-option label="故障" value=6></el-option>
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

  export default {

    data() {
      var selectList = new Set();
      var reg=/^(\d{1,3})(\.(\d{1,3})){3}$/
      var checkEmpty = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('输入不能为空'))
        }
        else{
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
        total: null,
        listLoading: true,
        defalutQuery:{
          page: 1,
          pagesize: 20
        },
        listQuery: {
          id:null,
          vip:null,
          sub1: null,
          sub2: null,
          name: null,
          os:null,
          dev_owner:null,
          lhzq_sn:null,
          ip1:null,
          ip2:null,
          flag:null,
          app_port:null,
          oem:null,
          main:null,
          model:null,
          app_version:null,
          config:null,
          op_owner:null,
          create_date:null,
          last_editor: null,
          update_date: null,
          page: 1,
          pagesize: 20

        },
        //edit temp
        temp: {
          id:null,
          vip:null,
          sub1: null,
          sub2: null,
          name: null,
          os:null,
          dev_owner:null,
          lhzq_sn:null,
          ip1:null,
          ip2:null,
          flag:null,
          app_port:null,
          oem:null,
          main:null,
          model:null,
          app_version:null,
          config:null,
          op_owner:null,
          create_date:null,
          last_editor: null,
          update_date: null
        },
        //create temp without idc_id
        ctemp: {
          vip:null,
          sub1: null,
          sub2: null,
          name: null,
          os:null,
          dev_owner:null,
          lhzq_sn:null,
          ip1:null,
          ip2:null,
          flag:null,
          app_port:null,
          oem:null,
          main:null,
          model:null,
          app_version:null,
          config:null,
          op_owner:null,
          create_date:null,
          last_editor: null,
          update_date: null
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
          isp:[{validator: checkEmpty, tirgger:'blur'}],
          city:[{validator:checkEmpty,tirgger:'blur'}]

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
          return this.temp.flag
        },
        set:function (value) {

          if (value==1){
            this.temp.flag= '线上'
          }
          if (value==2){
            this.temp.flag= '测试'
          }
          if (value==3){
            this.temp.flag= '开发'
          }
          if (value==4){
            this.temp.flag= '备机'
          }
          if (value==5){
            this.temp.flag= '下线'
          }
          if (value==6){
            this.temp.flag= '故障'
          }
        }


      }
    },
    methods:{
      getList(){
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/apps/getAllDevices',{params:this.listQuery}).then(response=>{
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err)=> {
          console.log(err)
        })


      },
      handleIconClick() {
        this.listQuery.page=1
        search(this.listQuery).then(response=>{
          this.list = response.data
        }).catch((err)=>{

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
        this.filterMessage=this.temp.flag
        this.transferSelect.splice(0,1,row.id)
        this.temp.id = this.transferSelect
        console.log(this.$store.getters.name)
        this.temp.last_editor = this.$store.getters.name
        this.temp.update_date = this.transferDate(date)
        console.log(this.temp)
        this.dialogFormVisible = true
      },
      handleDelete(index,row){
        console.log(row)
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/deleteApp', {id: [row.id]}).then(response => {
          console.log(response.data);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000

          })
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

        this.ctemp.last_editor = this.$store.getters.name
        console.log(this.ctemp)
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['时间', '地区', '类型', '标题', '重要性']
          const filterVal = ['timestamp', 'province', 'type', 'title', 'importance']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, 'table数据')
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

          this.multipleSelection.push(item.id);

        })
      },
      update(){
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/editApp', this.temp).then(response => {
          console.log(response)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
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
        this.temp.idc_id = this.multipleSelection

        console.log(this.temp)
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/editApp', this.temp).then(response => {
          console.log(response.data);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
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

            axios.post('http://cmdb.tigerbrokers.net:8000/apps/addApp', this.ctemp
            ).then(response => {
              console.log(response)
              this.dialogNewVisible = false
              this.$notify({
                title: '成功',
                message: '增加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(function (error) {
              console.log(error)
            })
          }else{
            alert('Can not submit')
          }
        })


      },

    }
  }
</script>
