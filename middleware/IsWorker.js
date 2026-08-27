 export default function IsWorker(req, res, next)
 {
   
  if (req.user.role !== "worker") {
   return res.status(403).render("access-denied");
    
  }
 
  next()
}