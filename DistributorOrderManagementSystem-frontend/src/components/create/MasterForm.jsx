import { useParams } from 'react-router-dom'
// import VoucherTypeMaster from '../../pages/master/voucher_type_master/VoucherTypeMaster'
import LedgerMaster from '../../pages/master/ledger_master/LedgerMaster'
import RegionMaster from '../../pages/master/region_master/RegionMaster'
import ExecutiveMaster from '../../pages/master/executive_master/ExecutiveMaster'
import DistributorMaster from '../../pages/master/distributor_master/DistributorMaster'
import ProductMaster from '../../pages/master/product_master/ProductMaster'
import GodownMaster from '../../pages/master/godown_master/GodownMaster'
import VoucherTypeCreate from '../../pages/master/voucher_type_master/VoucherTypeCreate'



const MasterForm = () => {

    const {type} = useParams();

    const renderComp = () => {
        switch(type){
            case 'voucherType':
                return <VoucherTypeCreate />
            case 'ledger':
                return <LedgerMaster />
            case 'region':
                return <RegionMaster />
            case 'executive':
                return <ExecutiveMaster />
            case 'distributor':
                return <DistributorMaster />
            case 'product':
                return <ProductMaster />
            case 'godown':
                return <GodownMaster />
        }
    }
  return (
    <>
        <div>{renderComp()}</div>
    </>
  )
}

export default MasterForm

