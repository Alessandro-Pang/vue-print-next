/*
 * @Author: zi.yang
 * @Date: 2025-05-09 19:48:03
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-09 19:48:25
 * @Description: 
 * @FilePath: /vue-print-next/demos/vue3-demo/src/utils/common.ts
 */
// 可用的纸张尺寸
export const paperSizes = [
  { value: 'A0', label: 'A0 (841mm × 1189mm)' },
  { value: 'A1', label: 'A1 (594mm × 841mm)' },
  { value: 'A2', label: 'A2 (420mm × 594mm)' },
  { value: 'A3', label: 'A3 (297mm × 420mm)' },
  { value: 'A4', label: 'A4 (210mm × 297mm)' },
  { value: 'A5', label: 'A5 (148mm × 210mm)' },
  { value: 'A6', label: 'A6 (105mm × 148mm)' },
  { value: 'A7', label: 'A7 (74mm × 105mm)' },
  { value: 'A8', label: 'A8 (52mm × 74mm)' },
  { value: 'Letter', label: 'Letter (215.9mm × 279.4mm)' },
  { value: 'Legal', label: 'Legal (215.9mm × 355.6mm)' },
  { value: 'Tabloid', label: 'Tabloid (279.4mm × 431.8mm)' },
  { value: 'custom', label: '自定义尺寸' },
];