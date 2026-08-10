gsap.from("nav",{
    y:50,
    duration:0.50,
    stagger:0.5
})

gsap.from(".hero1",{
    x:500,
    duration:0.50,
    stagger:0.5
})

gsap.from(".hero2",{
    x:-500,
    duration:0.50,
    stagger:0.5
})
gsap.from(".buttonss",{
    y:50,
    duration:0.50,
    stagger:true
})

gsap.from(".pictures",{
    y:500,
    opacity:0,
    duration:0.90,
    stagger:true
})

gsap.from(".images",{
    x:-1000,
    duration:0.90,
    stagger:true,
    scrollTrigger:{
        trigger:".images",
        scroller:"body",
        start:"top 70%",
        
        
    }
})

gsap.from(".about2",{
    x:1000,
    duration:0.90,
    stagger:true,
    scrollTrigger:{
        trigger:".about2",
        scroller:"body",
        start:"top 70%",
        
        
    }
})

gsap.from(".features",{
    y:-500,
    opacity:0,
    duration:1,
    stagger:true,
    stagger:0.5,
    scrollTrigger:{
        trigger:".features",
        scroller:"body",
        start:"top 70%",
        
        
    }
})


gsap.from(".f",{
    y:500,
    opacity:0,
    duration:1,
    stagger:true,
    stagger:0.5,
    scrollTrigger:{
        trigger:".f",
        scroller:"body",
        start:"top 70%",
        
        
    }
})

gsap.from(".box",{
    y:30,
    opacity:0,
    duration:0.5,
    stagger:true,
    stagger:0.5,
    scrollTrigger:{
        trigger:".f",
        scroller:"body",
        start:"top 70%",
        
        
    }
})

gsap.to(".revi",{
    x:"-200%",
    duration:190,
    reapeat:-1,
    ease:"expo.out"

})

gsap.from(".bo",{
    y:40,
    stagger:0.08,
    ease:"power3.out",
    opacity:0,
})

gsap.from(".rbox",{
    y:40,
    stagger:0.08,
    ease:"power3.out",
    opacity:0,
})

document.querySelectorAll(".alert").forEach(function(el){
    el.addEventListener("click",function(){
        alert("Reviews Submitted Sucessfully")
    })
})