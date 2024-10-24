package com.core;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.QuarkusApplication;

public class AppLifecycle implements QuarkusApplication {
    @Override
    public int run(String... args) {
        System.out.println("Aplicação iniciada...");
        Quarkus.waitForExit();
        return 0;
    }
}
