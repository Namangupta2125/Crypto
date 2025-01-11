const path = require('path')
const coinModel= require(path.join(__dirname,'..','Models','coinModel.js'))
 

// gets the latest recorded doc on coin
module.exports.getStat = async(req,res)=>{

    //checking if coin name is valid or not
   const validCoins = ["ethereum","bitcoin","matic"]
   let name = (req.query.coin || req.body.coin);
   if(name){
    name = name.toLowerCase();
   }
   
   if(!(validCoins.includes(name))){
      return res.status(400).json({error:"wrong entry in coin field please try again"})
   }

   try{
    const data = await coinModel.findOne({ name }).sort({ timestamp: -1 }).select("price marketCap change24h -_id"); 
        if (!data)
        {
           return res.status(404).json({ message: "No data found for the specified coin" });
        }
        return res.status(200).json(data);
   }
   catch(error)
   {
      res.status(500).json({ message:" sorry an error occurred" , error:error})
   }
}



// gets the deviation of prices
module.exports.getDeviation = async (req,res)=>{
    const validCoins = ["ethereum", "bitcoin", "matic"];
    const name = (req.query.coin || req.body.coin).toLowerCase();

    if (!validCoins.includes(name)) {
      return res.status(400).json({ error: "wrong entry in coin field please try again" });
    }

    try {
        let data = await coinModel.find({ name }).sort({timestamp:-1}).limit(100).select("price -_id")
        let dt = data.map(obj=>obj.price);
        res.status(200).json({deviation:standardDeviation(dt)});
    } 
    catch (error) {
      res.status(500).json({ message: "sorry an error occurred", error: error });
    }
}



//calculating standardDeviation
function standardDeviation(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }

  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const variance =numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) /numbers.length;
  const deviation = Math.sqrt(variance);
  return deviation.toFixed(6);
}
