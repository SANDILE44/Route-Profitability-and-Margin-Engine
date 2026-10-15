/* ==========================================================================
   ROUTE PROFITABILITY & MARGIN ENGINE - LOGIC & FINANCIAL CONTROLLER
   Architect: Sandile Thabede (Sandile SystemsWorks)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. DOM ELEMENT REFERENCES
    const inputs = {
        revenue: document.getElementById('revenue'),
        distance: document.getElementById('distance'),
        dieselPrice: document.getElementById('diesel-price'),
        consumption: document.getElementById('consumption'),
        tolls: document.getElementById('tolls'),
        driverRate: document.getElementById('driver-rate'),
        wearRate: document.getElementById('wear-rate')
    };

    const displays = {
        revenue: document.getElementById('revenue-val'),
        distance: document.getElementById('distance-val'),
        diesel: document.getElementById('diesel-val'),
        consumption: document.getElementById('consumption-val'),
        tolls: document.getElementById('tolls-val'),
        driver: document.getElementById('driver-val'),
        wear: document.getElementById('wear-val')
    };

    const kpis = {
        totalCost: document.getElementById('kpi-total-cost'),
        costPerKm: document.getElementById('kpi-cost-per-km'),
        netProfit: document.getElementById('kpi-net-profit'),
        marginPct: document.getElementById('kpi-margin-pct')
    };

    const riskBox = document.getElementById('risk-alert-box');
    const alertIcon = document.getElementById('alert-icon');
    const alertTitle = document.getElementById('alert-status-title');
    const alertSub = document.getElementById('alert-status-sub');
    const alertTag = document.getElementById('alert-tag');
    const alertDesc = document.getElementById('alert-description');
    const exportBtn = document.getElementById('export-pdf-btn');

    // 2. FORMATTER HELPERS (South African ZAR Currency)
    const formatZAR = (amount) => {
        return 'R ' + Number(amount).toLocaleString('en-ZA', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    // 3. INITIALIZE CHART.JS COST STRUCTURE BREAKDOWN
    const ctx = document.getElementById('costBreakdownChart').getContext('2d');
    const costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fuel Cost', 'Toll Fees', 'Driver & Overhead', 'Maintenance Wear', 'Net Profit'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#0088ff', // Fuel
                    '#ffb703', // Tolls
                    '#9333ea', // Driver
                    '#f97316', // Wear
                    '#00ffcc'  // Profit
                ],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        boxWidth: 12,
                        padding: 16
                    }
                }
            },
            cutout: '70%'
        }
    });

    // 4. CORE CALCULATION ENGINE
    function calculateEngine() {
        // Parse input values
        const revenue = parseFloat(inputs.revenue.value);
        const distance = parseFloat(inputs.distance.value);
        const dieselPrice = parseFloat(inputs.dieselPrice.value);
        const consumption = parseFloat(inputs.consumption.value); // L per 100km
        const tolls = parseFloat(inputs.tolls.value);
        const driverDailyRate = parseFloat(inputs.driverRate.value);
        const wearRatePerKm = parseFloat(inputs.wearRate.value);

        // Update slider pill text displays
        displays.revenue.textContent = formatZAR(revenue);
        displays.distance.textContent = distance + ' km';
        displays.diesel.textContent = 'R ' + dieselPrice.toFixed(2);
        displays.consumption.textContent = consumption + ' L';
        displays.tolls.textContent = formatZAR(tolls);
        displays.driver.textContent = formatZAR(driverDailyRate);
        displays.wear.textContent = 'R ' + wearRatePerKm.toFixed(2);

        // Mathematical Operations
        const fuelLitersNeeded = (distance / 100) * consumption;
        const totalFuelCost = fuelLitersNeeded * dieselPrice;
        
        // Estimate trip duration in days based on 500km daily average corridor capacity
        const estimatedDays = Math.max(1, distance / 500);
        const totalDriverCost = driverDailyRate * estimatedDays;

        const totalMaintenanceCost = distance * wearRatePerKm;

        // Total Operating Expense
        const totalCost = totalFuelCost + tolls + totalDriverCost + totalMaintenanceCost;
        
        // Net Financial Output
        const netProfit = revenue - totalCost;
        const costPerKm = distance > 0 ? totalCost / distance : 0;
        const netMarginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;

        // Render KPI Output Cards
        kpis.totalCost.textContent = formatZAR(totalCost);
        kpis.costPerKm.textContent = formatZAR(costPerKm);
        kpis.netProfit.textContent = formatZAR(netProfit);
        kpis.marginPct.textContent = netMarginPct.toFixed(1) + '%';

        // Style Net Profit Color based on positivity
        if (netProfit >= 0) {
            kpis.netProfit.style.color = 'var(--accent-green)';
        } else {
            kpis.netProfit.style.color = 'var(--accent-red)';
        }

        // 5. AUTOMATED RISK & MARGIN PROTECTION EVALUATION
        updateRiskEngine(netMarginPct, costPerKm, revenue);

        // 6. UPDATE CHART DATA
        // Ensure negative profit doesn't break chart sizing
        const chartProfit = Math.max(0, netProfit);
        costChart.data.datasets[0].data = [
            totalFuelCost.toFixed(2),
            tolls.toFixed(2),
            totalDriverCost.toFixed(2),
            totalMaintenanceCost.toFixed(2),
            chartProfit.toFixed(2)
        ];
        costChart.update();
    }

    // 7. RISK EVALUATION LOGIC
    function updateRiskEngine(marginPct, costPerKm, revenue) {
        // Reset classes
        riskBox.className = 'panel alert-panel';

        if (marginPct >= 25.0) {
            riskBox.classList.add('status-optimal');
            alertIcon.className = 'fa-solid fa-circle-check';
            alertTitle.textContent = 'OPTIMAL ROUTE MARGIN';
            alertSub.textContent = 'High profitability threshold achieved';
            alertTag.textContent = 'PROFITABLE';
            alertTag.style.color = 'var(--accent-green)';
            alertDesc.textContent = `Route retention is strong at ${marginPct.toFixed(1)}%. Operational expenses and fuel burn are well-balanced against contract revenue. Recommended for dispatch.`;
        } else if (marginPct >= 12.0 && marginPct < 25.0) {
            riskBox.classList.add('status-warning');
            alertIcon.className = 'fa-solid fa-triangle-exclamation';
            alertTitle.textContent = 'MODERATE RISK: MONITOR FUEL';
            alertSub.textContent = 'Margin approaching baseline tolerance';
            alertTag.textContent = 'MONITOR';
            alertTag.style.color = 'var(--accent-yellow)';
            alertDesc.textContent = `Net margin sits at ${marginPct.toFixed(1)}%. Minor fluctuations in diesel rates or unbudgeted toll delays could compress profitability below target thresholds.`;
        } else {
            riskBox.classList.add('status-critical');
            alertIcon.className = 'fa-solid fa-radiation';
            alertTitle.textContent = 'CRITICAL: MARGIN BLEED WARNING';
            alertSub.textContent = 'High operational risk or negative return';
            alertTag.textContent = 'MARGIN BLEED';
            alertTag.style.color = 'var(--accent-red)';
            alertDesc.textContent = `WARNING: Margin retention has dropped to ${marginPct.toFixed(1)}%. Cost-per-KM is dangerously close to or exceeding revenue yield. Immediate contract renegotiation or route optimization required.`;
        }
    }

    // 8. EVENT LISTENERS FOR LIVE COMPUTATION
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateEngine);
    });

    // 9. PDF EXECUTIVE BRIEF EXPORT HANDLER
    exportBtn.addEventListener('click', () => {
        exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Brief...';
        
        const element = document.getElementById('report-content');
        const opt = {
            margin:       10,
            filename:     'Route_Profitability_Executive_Brief.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#090d16' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Export Executive Brief';
        });
    });

    // Run calculation on initial load
    calculateEngine();
});
