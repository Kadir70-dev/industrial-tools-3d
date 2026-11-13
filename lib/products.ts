export type Product = { id: string; name: string; category: string; descriptor: string; spec: string; priceNote: string; tone: string; type: 'drill'|'driver'|'grinder'|'saw'|'hammer'|'kit'|'bits'|'wrench'; featured?: boolean };
export const categories = ['All tools','Drills','Screwdrivers','Grinders','Cutting tools','Hand tools','Toolkits','Accessories'];
export const products: Product[] = [
  {id:'d18',name:'FW 18V Compact Drill',category:'Drills',descriptor:'Built for controlled daily work.',spec:'18V · 65 Nm · 2-speed',priceNote:'Quote on request',tone:'#ef6c28',type:'drill',featured:true},
  {id:'id20',name:'FW 20V Impact Driver',category:'Screwdrivers',descriptor:'High-torque fastening, refined.',spec:'20V · 210 Nm · ¼″ hex',priceNote:'Quote on request',tone:'#e36a2d',type:'driver'},
  {id:'ag125',name:'FW 125 Angle Grinder',category:'Grinders',descriptor:'A steady hand for demanding cuts.',spec:'125 mm · 1,200 W · M14',priceNote:'Quote on request',tone:'#d9d5cb',type:'grinder'},
  {id:'cs185',name:'FW 185 Circular Saw',category:'Cutting tools',descriptor:'Clean lines through solid stock.',spec:'185 mm · 1,600 W · 66 mm cut',priceNote:'Quote on request',tone:'#e8e2d6',type:'saw'},
  {id:'hm2',name:'FW Pro Claw Hammer',category:'Hand tools',descriptor:'A balanced strike. Every time.',spec:'450 g · forged steel · soft grip',priceNote:'Quote on request',tone:'#e3d8c9',type:'hammer'},
  {id:'case48',name:'FW 48-Piece Workshop Set',category:'Toolkits',descriptor:'The essentials, ready to move.',spec:'48 pcs · impact-rated case',priceNote:'Quote on request',tone:'#d7d8d5',type:'kit'},
  {id:'bit45',name:'FW Impact Bit Assortment',category:'Accessories',descriptor:'Reliable engagement across fasteners.',spec:'45 pcs · S2 steel · PH/PZ/TX',priceNote:'Quote on request',tone:'#bebfbc',type:'bits'},
  {id:'wr10',name:'FW Adjustable Wrench',category:'Hand tools',descriptor:'Fine adjustment. Confident grip.',spec:'250 mm · chrome vanadium',priceNote:'Quote on request',tone:'#ccd0d0',type:'wrench'},
];
