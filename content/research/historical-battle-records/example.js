// Constructed teaching example, not a quotation from the historical corpus.
export const EXAMPLE = {
 id:'example-01', evidence:'sentence-01',
 fields:['unit','place','time','event'],
 labels:{unit:'Unit',place:'Place',time:'Time',event:'Event'},
 ko:{
  parts:[{field:'time',text:'9월 15일 오전'},{text:', '},{field:'unit',text:'A부대'},{text:'는 '},{field:'place',text:'B해안'},{text:'에 '},{field:'event',text:'상륙했다'},{text:'.'}],
  note:'연결 방식을 보여주기 위해 만든 예문입니다.',
  instruction:'항목을 누르면 원문에서 해당 근거가 강조됩니다.',
  overview:'부대·장소·시간·사건을 원문의 해당 표현과 연결해 기록합니다.',
  details:{
   unit:'부대 표현과 그 표현이 등장한 원문 위치를 함께 기록합니다.',
   place:'장소 표현을 기록하고 같은 문장에 있는 근거를 연결합니다.',
   time:'문장에 적힌 날짜와 시간대를 그대로 보존합니다.',
   event:'상륙 동작을 Land로 분류하고 해당 서술을 근거로 연결합니다.'
  }
 },
 en:{
  parts:[{text:'On '},{field:'time',text:'the morning of 15 September'},{text:', '},{field:'unit',text:'Unit A'},{text:' '},{field:'event',text:'landed'},{text:' at '},{field:'place',text:'Beach B'},{text:'.'}],
  note:'A constructed sentence illustrating evidence links.',
  instruction:'Select a field to highlight its evidence in the sentence.',
  overview:'Units, places, times and events remain linked to their supporting expressions.',
  details:{
   unit:'The unit expression is stored together with its location in the source.',
   place:'The place expression links back to evidence in the same sentence.',
   time:'The date and time of day are preserved as stated in the sentence.',
   event:'The landing action is typed as Land and linked to the supporting expression.'
  }
 }
};
export function evidenceFor(field,language='en'){
 const copy=EXAMPLE[language==='ko'?'ko':'en'];
 const span=copy.parts.find(part=>part.field===field)?.text;
 if(!span)return undefined;
 return {field,label:EXAMPLE.labels[field],value:field==='event'?'Land':span,span,source:EXAMPLE.id,evidence:EXAMPLE.evidence,detail:copy.details[field]};
}
