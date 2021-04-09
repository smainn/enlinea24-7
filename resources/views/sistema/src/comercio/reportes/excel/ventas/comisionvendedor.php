
    <?php 
        $id = 0; 
        $totalGeneral = 0;
        $comisionGeneral = 0;

        $totalCobrado = 0;
        $comisionCobrado = 0;

        $totalPorCobrar = 0;
        $comisionPorCobrar = 0;

        $subTotal = 0;
        $comisionSubTotal = 0;

        $subTotalCobrado = 0;
        $comisionSubTotalCobrado = 0;

        $subTotalPorcobrar = 0;
        $comisionSubTotalPorCobrar = 0;

        $bandera = 0;

    ?>
    <table>
        <tr>
            <th colspan="8" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <strong>Reporte De Comisiones Por Vendedores</strong>
            </th>
        </tr>

        <?php foreach ($comision as $c) { ?>
            <thead>

                <?php if ($id != $c->idvendedor) { ?>
                    <?php if ($bandera == 1) { ?>
                        
                        <tr>
                            <td colspan="4" 
                                style="width: 20px; height: 27px; 
                                    border-left: 1px solid #000000;
                                    text-align: right; font-size: 14px;"  
                            >
                                <strong>Total: </strong>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $subTotal ?>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $comisionSubTotal ?>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $subTotalCobrado ?>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $comisionSubTotalCobrado ?>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $subTotalPorcobrar ?>
                            </td>
                            <td style="width: 20px; height: 27px; font-size: 12px;">
                                <?= $comisionSubTotalPorCobrar ?>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="15"></td>
                        </tr>
                    
                    <?php } 
                        $bandera = 1;
                        $subTotal = 0;
                        $comisionSubTotal = 0;
                        $subTotalCobrado = 0;
                        $comisionSubTotalCobrado = 0;
                        $subTotalPorcobrar = 0;
                        $comisionSubTotalPorCobrar = 0;
                    ?>
                    <tr>
                        <th colspan="2" 
                            style="width: 20px; height: 27px; 
                                    border-left: 1px solid #000000;
                                    text-align: left; font-size: 14px;" >
                            <strong>
                                Id Vendedor: 
                            </strong>
                        </th>
                        <th style="width: 20px; text-align: left;
                                height: 27px; font-size: 12px;">
                            <?= $c->idvendedor ?>
                        </th>
                        <th colspan="2" 
                            style="width: 20px; height: 27px; 
                                    border-left: 1px solid #000000;
                                    text-align: left; font-size: 14px;">
                            <strong>
                                Nombre Vendedor: 
                            </strong>
                        </th>
                        <th colspan="5" style="width: 20px; height: 27px; font-size: 12px;">
                            <?= ucwords($c->vendedor) ?>
                        </th>
                    </tr>
                    
                    <tr>
                        <th colspan="2"
                            style="height: 22px; text-align: center; font-size: 13px;"
                        >
                            <strong>Venta</strong>
                        </th>
                        <th style="height: 22px; text-align: center; font-size: 13px;"></th>
                        <th style="height: 22px; text-align: center; font-size: 13px;">
                            <strong>Comision</strong>
                        </th>
                        <th colspan="2" style="height: 22px; text-align: center; font-size: 13px;">
                            <strong>Total</strong>
                        </th>
                        <th colspan="2" style="height: 22px; text-align: center; font-size: 13px;">
                            <strong>Cobro Acumulados</strong>
                        </th>
                        <th colspan="2" style="height: 22px; text-align: center; font-size: 13px;">
                            <strong>Por Cobrar</strong>
                        </th>
                    </tr>
                
                    <tr>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Id</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Fecha</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Cliente</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Asignado</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Monto</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Comisión</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Monto</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Comisión</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Saldo</strong>
                        </th>
                        <th style="height: 22px; width: 20; text-align: center; font-size: 13px;">
                            <strong>Comisión</strong>
                        </th>
                    </tr>
                    
                <?php }?>
                
                <tr>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= $c->idventa ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= date("d/m/Y", strtotime($c->fecha)) ?>
                    </td>
                    <td style="height: 30px; text-align: center; font-size: 12px;">
                        <?= ucwords($c->cliente) ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= $c->comision.'%' ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= $c->total ?>
                        <?php $totalGeneral += $c->total; ?>
                        <?php $subTotal += $c->total; ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= round((($c->comision / 100)*($c->total)), 2) ?>
                        <?php $comisionGeneral += round((($c->comision / 100)*($c->total)), 2) ?>
                        <?php $comisionSubTotal += round((($c->comision / 100)*($c->total)), 2) ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= $c->cobrado ?>
                        <?php $totalCobrado += $c->cobrado; ?>
                        <?php $subTotalCobrado += $c->cobrado; ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= round((($c->comision / 100)*($c->cobrado)), 2) ?>
                        <?php $comisionCobrado += round((($c->comision / 100)*($c->cobrado)), 2) ?>
                        <?php $comisionSubTotalCobrado += round((($c->comision / 100)*($c->cobrado)), 2) ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= ($c->tipo == 2)?($c->total - $c->cobrado):'0' ?>
                        <?php $totalPorCobrar += ($c->tipo == 2)?($c->total - $c->cobrado):0; ?>
                        <?php $subTotalPorcobrar += ($c->tipo == 2)?($c->total - $c->cobrado):0; ?>
                    </td>
                    <td style="height: 20px; text-align: center; font-size: 12px;">
                        <?= ($c->tipo == 2)?round((($c->comision / 100)*($c->total - $c->cobrado)), 2):0; ?>
                        <?php $comisionPorCobrar += ($c->tipo == 2)?round((($c->comision / 100)*($c->total - $c->cobrado)), 2):0; ?>
                        <?php $comisionSubTotalPorCobrar += ($c->tipo == 2)?round((($c->comision / 100)*($c->total - $c->cobrado)), 2):0; ?>
                    </td>
                </tr>
                    
                <?php 
                    if ($id != $c->idvendedor) { 
                        $id = $c->idvendedor;
                    }
                ?>
            </thead>
        <?php } ?>
        <thead>
            
            <tr>
                <td colspan="4" 
                    style="width: 20px; height: 27px; 
                            border-left: 1px solid #000000;
                            text-align: right; font-size: 14px;" 
                >
                    <strong>Total: </strong>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $subTotal ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionSubTotal ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $subTotalCobrado ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionSubTotalCobrado ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $subTotalPorcobrar ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionSubTotalPorCobrar ?>
                </td>
            </tr>

            <tr>
                <td colspan="15"></td>
            </tr>

            <tr>
                <td colspan="4" 
                    style="width: 20px; height: 27px; 
                        border-left: 1px solid #000000;
                        text-align: right; font-size: 14px;" 
                >
                    <strong>Total General: </strong>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $totalGeneral ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionGeneral ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $totalCobrado ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionCobrado ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $totalPorCobrar ?>
                </td>
                <td style="width: 20px; height: 27px; font-size: 12px;">
                    <?= $comisionPorCobrar ?>
                </td>
            </tr>
            
        </thead>
    </table>


