package com.smartparking.controller;

import com.smartparking.common.ApiResponse;
import com.smartparking.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/edge")
public class EdgeController {

    @Autowired
    private VehicleService vehicleService;

    /**
     * 接收边缘设备识别的车牌
     */
    @PostMapping("/license-plate")
    public ApiResponse<String> receiveLicensePlate(
            @RequestParam String plateNumber,
            @RequestParam(defaultValue = "A001") String spotNumber) {
        try {
            // 模拟分配车位：A001, A002, ...
            vehicleService.vehicleEntry(plateNumber, spotNumber);
            return ApiResponse.success("车牌识别成功，车辆已入场");
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取设备状态
     */
    @GetMapping("/status")
    public ApiResponse<String> getDeviceStatus() {
        return ApiResponse.success("设备在线");
    }
}
