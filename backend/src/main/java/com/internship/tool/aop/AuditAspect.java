package com.internship.tool.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    @After("execution(* com.internship.tool.controller.*.create*(..)) || " +
           "execution(* com.internship.tool.controller.*.update*(..)) || " +
           "execution(* com.internship.tool.controller.*.delete*(..))")
    public void logAudit(JoinPoint joinPoint) {
        System.out.println("AUDIT: " + joinPoint.getSignature().getName());
    }
}