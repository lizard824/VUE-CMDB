<template>
  <div class="app-container">
    <div style="float: left; margin: 20px;" >
      <el-upload
        class="upload-demo"
        action="http://cmdb.tigerbrokers.net:8000/apps/uploadApp"
        :show-file-list= "false"
        :on-error="uploadError"
        :on-success="uploadSuccess">
        <el-button  type="primary" v-if="this.$store.getters.perms.indexOf('2l')>-1 ||this.$store.getters.perms.indexOf('5')>-1 ">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件(文件格式遵循导出文件)</div>
      </el-upload>
    </div>
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true" v-if="this.$store.getters.perms.indexOf('2r')>-1 ||this.$store.getters.perms.indexOf('5')>-1 ">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" v-if="this.$store.getters.perms.indexOf('2c')>-1 ||this.$store.getters.perms.indexOf('5')>-1 ">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload" v-if="this.$store.getters.perms.indexOf('2l')>-1 ||this.$store.getters.perms.indexOf('5')>-1 ">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="dialogMultiVisible=true" type="primary" icon="edit" v-if="this.$store.getters.perms.indexOf('2u')>-1 ||this.$store.getters.perms.indexOf('5')>-1 ">批量修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="MultiDelete" type="primary"
                 icon="edit"v-if="this.$store.getters.perms.indexOf('2d')>-1 || this.$store.getters.perms.indexOf('5')>-1">批量删除
      </el-button>
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
            <el-form-item label="厂商">
              <span>{{ scope.row.oem }}</span>
            </el-form-item>
            <el-form-item label="型号">
              <span>{{ scope.row.model }}</span>
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
        label="老虎资产"
        prop="lhzq_sn" sortable>
      </el-table-column>

      <el-table-column
        label="机房"
        prop="isp" sortable>
      </el-table-column>
      <el-table-column
        label="机柜"
        prop="name" sortable>
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
        label="业务主类"
        prop="main" sortable>
      </el-table-column>
      <el-table-column
        label="业务子类"
        prop="sub1" sortable>
      </el-table-column>
      <el-table-column
        label="业务子类"
        prop="sub2" sortable>
      </el-table-column>
      <el-table-column
        label="版本"
        prop="app_version" sortable>
      </el-table-column>
      <el-table-column
        label="端口"
        prop="app_port" sortable>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="flag" sortable>
        <template scope="scope">
          {{scope.row.flag |flagV}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作系统"
        prop="os" sortable>
      </el-table-column>
      <el-table-column
        label="运维者"
        prop="op_owner" sortable>
      </el-table-column>
      <el-table-column
        label="开发者"
        prop="dev_owner" sortable>
      </el-table-column>



      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="perms.indexOf('2u')>-1 ||perms.indexOf('5')>-1 "
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="perms.indexOf('2d')>-1 ||perms.indexOf('5')>-1 "
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
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
          <el-input v-model="ctemp.lhzq_sn" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >-->
          <!--<el-input v-model="ctemp.isp" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >-->
          <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >-->
          <!--<el-input v-model="ctemp.ip1" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >-->
          <!--<el-input v-model="ctemp.ip2" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
          <el-input v-model="ctemp.main" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
          <el-input v-model="ctemp.sub1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
          <el-input v-model="ctemp.sub2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
          <el-input v-model="ctemp.app_version" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
          <el-input v-model="ctemp.app_port" auto-complete="off"></el-input>
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
        <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
          <el-input v-model="ctemp.os" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
          <el-input v-model="ctemp.op_owner" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
          <el-input v-model="ctemp.dev_owner" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
          <el-input v-model="ctemp.vip" auto-complete="off" ></el-input>
        </el-form-item>
        <!--<el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >-->
          <!--<el-input v-model="ctemp.oem" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="型号" :label-width="formLabelWidth" prop="model" >-->
          <!--<el-input v-model="ctemp.model" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="配置" :label-width="formLabelWidth" prop="config">-->
          <!--<el-input v-model="ctemp.config" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->


        <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
          <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->






      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!--editdialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

          <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
            <el-input v-model="temp.lhzq_sn" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >-->
            <!--<el-input v-model="temp.isp" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
        <!--<el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >-->
          <!--<el-input v-model="temp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
          <!--<el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >-->
            <!--<el-input v-model="temp.ip1" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >-->
            <!--<el-input v-model="temp.ip2" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
            <el-input v-model="temp.main" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
            <el-input v-model="temp.sub1" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
            <el-input v-model="temp.sub2" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
            <el-input v-model="temp.app_version" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
            <el-input v-model="temp.app_port" auto-complete="off"></el-input>
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
          <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
            <el-input v-model="temp.os" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
            <el-input v-model="temp.op_owner" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
            <el-input v-model="temp.dev_owner" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
            <el-input v-model="temp.vip" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >-->
            <!--<el-input v-model="temp.oem" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="型号" :label-width="formLabelWidth" prop="model" >-->
            <!--<el-input v-model="temp.model" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="配置" :label-width="formLabelWidth" prop="config">-->
            <!--<el-input v-model="temp.config" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->


          <!--<el-form-item label="位置" :label-width="formLabelWidth" prop="gateway" >-->
        <!--<el-input v-model="ctemp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->






      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMultiVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

          <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
            <el-input v-model="temp.lhzq_sn" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >-->
            <!--<el-input v-model="temp.isp" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
        <!--<el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >-->
          <!--<el-input v-model="temp.name" auto-complete="off" ></el-input>-->
        <!--</el-form-item>-->
          <!--<el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >-->
            <!--<el-input v-model="temp.ip1" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >-->
            <!--<el-input v-model="temp.ip2" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
            <el-input v-model="temp.main" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
            <el-input v-model="temp.sub1" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
            <el-input v-model="temp.sub2" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
            <el-input v-model="temp.app_version" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
            <el-input v-model="temp.app_port" auto-complete="off"></el-input>
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
          <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
            <el-input v-model="temp.os" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
            <el-input v-model="temp.op_owner" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
            <el-input v-model="temp.dev_owner" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
            <el-input v-model="temp.vip" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >-->
            <!--<el-input v-model="temp.oem" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="型号" :label-width="formLabelWidth" prop="model" >-->
            <!--<el-input v-model="temp.model" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="配置" :label-width="formLabelWidth" prop="config">-->
            <!--<el-input v-model="temp.config" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->

        </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMultiVisible = false">取 消</el-button>
        <el-button type="primary" @click="MultiUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible">
      <el-form :model="listQuery" status-icon  ref="listQuery" label-width="100px" class="demo-ruleForm">


          <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhzq_sn" >
            <el-input v-model="listQuery.lhzq_sn" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
            <el-input v-model="listQuery.isp" auto-complete="off" ></el-input>
          </el-form-item>
        <el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="listQuery.name" auto-complete="off" ></el-input>
        </el-form-item>
          <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
            <el-input v-model="listQuery.ip1" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
            <el-input v-model="listQuery.ip2" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务主类" :label-width="formLabelWidth" prop="main" >
            <el-input v-model="listQuery.main" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub1" >
            <el-input v-model="listQuery.sub1" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="业务子类" :label-width="formLabelWidth" prop="sub2" >
            <el-input v-model="listQuery.sub2" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="版本" :label-width="formLabelWidth" prop="app_version">
            <el-input v-model="listQuery.app_version" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth" prop="app_port">
            <el-input v-model="listQuery.app_port" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth" prop="flag">
            <el-select v-model="listQuery.flag" placeholder="请选择状态">
              <el-option label="线上" value=1></el-option>
              <el-option label="测试" value=2></el-option>
              <el-option label="开发" value=3></el-option>
              <el-option label="备机" value=4></el-option>
              <el-option label="下线" value=5></el-option>
              <el-option label="故障" value=6></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作系统" :label-width="formLabelWidth" prop="os" >
            <el-input v-model="listQuery.os" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="运维者" :label-width="formLabelWidth" prop="op_owner" >
            <el-input v-model="listQuery.op_owner" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="开发者" :label-width="formLabelWidth" prop="dev_owner">
            <el-input v-model="listQuery.dev_owner" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="虚拟IP" :label-width="formLabelWidth" prop="vip" >
            <el-input v-model="listQuery.vip" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >-->
            <!--<el-input v-model="listQuery.oem" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="型号" :label-width="formLabelWidth" prop="model" >-->
            <!--<el-input v-model="listQuery.model" auto-complete="off" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="配置" :label-width="formLabelWidth" prop="config">-->
            <!--<el-input v-model="listQuery.config" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->


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
        row:null,
        total: null,
        listLoading: true,
        defalutQuery:{
          page: 1,
          pagesize: 20
        },
        listQuery: {
          id:"",
          isp:"",
          vip:"",
          sub1: "",
          sub2: "",
          name: "",
          os:"",
          dev_owner:"",
          lhzq_sn:"",
          ip1:"",
          ip2:"",
          flag:"",
          app_port:"",
          oem:"",
          main:"",
          model:"",
          app_version:"",
          config:"",
          op_owner:"",
          create_date:"",
          last_editor: "",
          update_date: "",
          page: 1,
          pagesize: 20

        },
        //edit temp
        temp: {
          id:"",
          vip:"",
          sub1: "",
          sub2: "",
          os:"",
          dev_owner:"",
          lhzq_sn:"",
          flag:"",
          app_port:"",
          main:"",
          app_version:"",
          op_owner:"",
          create_date:"",
          last_editor: "",
          update_date: ""
        },
        //create temp without idc_id
        ctemp: {
          vip:"",
          sub1: "",
          sub2: "",
          os:"",
          dev_owner:"",
          lhzq_sn:"",
          flag:"",
          app_port:"",
          main:"",
          app_version:"",
          op_owner:"",
          create_date:"",
          last_editor: "",
          update_date: ""
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
      console.log(this.$store.getters.perms.split(','))
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


      },
      reverseMessage:{
        get:function(){
          return this.temp.flag
          debugger
        },
        set:function(val){
          console.log('%s%s','before transfer',val)
          if(val.indexOf('线上')>-1){
            this.temp.flag= 1

          }
          if(val.indexOf('测试')>-1){
            this.temp.flag = 2
          }
          if(val.indexOf('开发')>-1){
            this.temp.flag = 3
          }
          if(val.indexOf('备机')>-1){
            this.temp.flag = 4
          }
          if(val.indexOf('下线')>-1){
            this.temp.flag = 5
          }
          if(val.indexOf('故障')>-1){
            this.temp.flag = 6
          }
        }
      },
      perms(){
        return this.$store.getters.perms
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
        this.dialogSearchVisible = false
        this.listLoading =  true
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/searchApp',this.listQuery).then(response => {
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false


        }).catch((err) => {
          console.log(err)
          this.listLoading =  false
        })


      },
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        if(Object.keys(this.listQuery).length>2){
          axios.post('http://cmdb.tigerbrokers.net:8000/apps/searchApp',this.listQuery).then(response => {
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
          axios.post('http://cmdb.tigerbrokers.net:8000/apps/searchApp',this.listQuery).then(response => {
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
      handleEdit(index,row){
        var date = new Date()
        this.dialogStatus = 'edit'
        console.log(row)
        this.temp = Object.assign({}, row)
        this.filterMessage=this.temp.flag
        this.transferSelect.splice(0,1,row.id)
        this.temp.id = this.transferSelect
        console.log(this.$store.getters.username)
        this.temp.last_editor = this.$store.getters.username
        this.temp.update_date = this.transferDate(date)
        console.log(this.temp)
        this.dialogFormVisible = true
        this.row = row
      },
      handleDelete(index,row){
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
          axios.post('http://cmdb.tigerbrokers.net:8000/apps/deleteApp', {id: [row.id]}).then(response => {
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
          const tHeader = ['老虎资产', '机房', '机柜',  '外网地址','内网地址','业务主类','业务子类1','业务子类2','版本','端口','状态','操作系统','运维者','开发者','虚拟IP','配置','厂商','型号','创建日期','修改日期','修改者']
          const filterVal = ['lhzq_sn', 'isp', 'name',  'ip1','ip2','main','sub1','sub2','app_version','app_port','flag','os','op_owner','dev_owner','vip','config','oem','model','create_date','update_date','last_editor']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, '应用数据')
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
        this.reverseMessage=this.temp.flag
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/editApp', this.temp).then(response => {
          console.log(response)
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
          this.dialogFormVisible = false
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
        this.temp.id = this.multipleSelection
        this.reverseMessage=this.temp.flag
        console.log(this.temp)
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/editApp', this.temp).then(response => {
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

            axios.post('http://cmdb.tigerbrokers.net:8000/apps/addApp', this.ctemp
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

          this.multipleSelection.push(item.id);

        })
        axios.post('http://cmdb.tigerbrokers.net:8000/apps/deleteApp', {id: this.multipleSelection}).then(response => {
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
