package prometheus

import (
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    successCounter = prometheus.NewCounter(prometheus.CounterOpts{
        Name: "compra_success_total",
        Help: "Total de compras realizadas com sucesso",
    })

    failureCounter = prometheus.NewCounter(prometheus.CounterOpts{
        Name: "compra_failure_total",
        Help: "Total de compras que falharam",
    })
)

func SetupMetrics() {
    prometheus.MustRegister(successCounter)
    prometheus.MustRegister(failureCounter)

    go func() {
        http.Handle("/metrics", promhttp.Handler())
        log.Fatal(http.ListenAndServe(":2112", nil))
    }()
}

func IncrementSuccess() {
    successCounter.Inc()
}

func IncrementFailures() {
    failureCounter.Inc()
}
