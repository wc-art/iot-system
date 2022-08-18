<template>
  <el-table :data="tableData" stripe max-height="100vh">
    <el-table-column v-for="item in tableProps" :prop="item" :label="item" width="120" :key="item" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue';
import * as xlsx from 'xlsx';
import axios from 'axios';

const url = 'src/assets/2022-5-5-16.00.csv';

async function getJsonByCSV(url) {
  const { data } = await axios.get(decodeURI(url), { responseType: 'arraybuffer' });
  let utf8decoder = new TextDecoder('gbk');
  let binary = utf8decoder.decode(data);
  const ctx = xlsx.read(binary, { type: 'binary', codepage: 936 });
  const result = xlsx.utils.sheet_to_json(ctx.Sheets[ctx.SheetNames[0]], { header: 1 });
  return result
}

function jsonToTable(data) {
  let res = new Array(data.length - 1).fill('').map(item => ({}));
  for (let i = 0; i < data[0].length; i++) {
    const prop = data[0][i];
    for (let j = 0; j < res.length; j++) {
      const obj = res[j];
      obj[prop] = data[j + 1][i] ? data[j + 1][i] : 0;
    }
  }
  console.log(res);
  return res;
}

const tableProps = ref([]);
const tableData = ref([]);

onMounted(async () => {
  let result = await getJsonByCSV(url)
  tableProps.value = result[0]
  tableData.value = jsonToTable(result)
})
</script>

<style scoped>
</style>
