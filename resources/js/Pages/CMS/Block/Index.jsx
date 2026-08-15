import React, { useState, useEffect, useCallback } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';

export default function Index({ page, blocks: initialBlocks, blockTypes = {} }) {
    const [blocks, setBlocks] = useState(initialBlocks || []);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setBlocks(initialBlocks || []);
    }, [initialBlocks]);

    const firstType = Object.keys(blockTypes)[0] || 'text_block';

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        type: firstType,
        status: 'active'
    });

    const handleAddBlock = (e) => {
        e.preventDefault();
        post(route('cms.block.store', page.id), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa Block này? Hành động này sẽ được đưa vào thùng rác.')) {
            router.delete(route('cms.block.destroy', id));
        }
    };

    const handleToggleStatus = (block) => {
        const newStatus = block.status === 'active' ? 'inactive' : 'active';
        router.put(route('cms.block.update', block.id), {
            title: block.title,
            status: newStatus,
            data: block.data
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDuplicate = (block) => {
        router.post(route('cms.block.store', page.id), {
            title: `${block.title || 'Block'} (Bản sao)`,
            type: block.type,
            status: 'active'
        }, {
            preserveScroll: true,
        });
    };

    const onDragEnd = useCallback((result) => {
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        
        if (sourceIndex === destinationIndex) return;
        
        const newBlocks = Array.from(blocks);
        const [reorderedItem] = newBlocks.splice(sourceIndex, 1);
        newBlocks.splice(destinationIndex, 0, reorderedItem);
        
        setBlocks(newBlocks);
        
        router.post(route('cms.block.reorder'), {
            ids: newBlocks.map(b => b.id)
        }, { preserveScroll: true });
    }, [blocks]);

    return (
        <CMSLayout>
            <Head title={`Quản lý Block: ${page.name} - CMS`} />
            
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="wow-title mb-1">Cấu trúc trang: {page.name}</h2>
                    <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Quản lý và sắp xếp các khối giao diện (Blocks) trên trang này.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <Link href={route('cms.page.index')} className="wow-btn-light">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </Link>
                    <ShimmerButton onClick={() => setShowAddModal(true)} className="fw-bold px-4 py-2">
                        <i className="fa-solid fa-plus me-2"></i> Thêm Block mới
                    </ShimmerButton>
                </div>
            </div>

            <div className="wow-card">
                <div className="wow-card-body p-0">
                    <div className="wow-table-wrapper" style={{ padding: '0 30px 30px' }}>
                        <table className="wow-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Tiêu đề (Title)</th>
                                    <th>Loại (Type)</th>
                                    <th style={{ width: '130px' }}>Trạng thái</th>
                                    <th className="text-end">Hành động</th>
                                </tr>
                            </thead>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="blocks-list">
                                    {(provided) => (
                                        <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                            {blocks && blocks.length > 0 ? (
                                                blocks.map((block, index) => (
                                                    <Draggable key={block.id.toString()} draggableId={block.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <tr 
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    backgroundColor: snapshot.isDragging ? 'var(--wow-bg)' : 'inherit',
                                                                    display: snapshot.isDragging ? 'table' : 'table-row',
                                                                    boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
                                                                }}
                                                            >
                                                                <td style={{ color: 'var(--wow-text-muted)' }}>
                                                                    <div {...provided.dragHandleProps} style={{ display: 'inline-block', paddingRight: '8px' }}>
                                                                        <i className="fa-solid fa-grip-vertical" style={{ cursor: 'grab', opacity: 0.5 }}></i>
                                                                    </div>
                                                                    {index + 1}
                                                                </td>
                                                                <td style={{ fontWeight: 600 }}>
                                                                    {(block.title ? block.title.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() : '') || 'Block không tên'}
                                                                </td>
                                                                <td style={{ color: 'var(--wow-primary)' }}>{blockTypes[block.type]?.name || block.type}</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <label className="wow-switch m-0" title={block.status === 'active' ? "Nhấn để Ẩn block" : "Nhấn để Bật block"}>
                                                                            <input 
                                                                                type="checkbox" 
                                                                                checked={block.status === 'active'}
                                                                                onChange={() => handleToggleStatus(block)}
                                                                            />
                                                                            <span className="wow-slider"></span>
                                                                        </label>
                                                                        <span className="small fw-semibold" style={{ color: block.status === 'active' ? '#22c55e' : '#94a3b8' }}>
                                                                            {block.status === 'active' ? 'Bật' : 'Ẩn'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="text-end">
                                                                    <button onClick={() => handleDuplicate(block)} className="wow-btn-icon me-2 text-info" title="Nhân bản Block này">
                                                                        <i className="fa-regular fa-clone"></i>
                                                                    </button>
                                                                    <Link href={route('cms.block.edit', block.id)} className="wow-btn-icon me-2" title="Cấu hình nội dung">
                                                                        <i className="fa-solid fa-gear"></i>
                                                                    </Link>
                                                                    <button onClick={() => handleDelete(block.id)} className="wow-btn-icon text-danger" style={{ borderColor: 'transparent', background: 'rgba(255, 0, 85, 0.1)' }} title="Xóa Block">
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--wow-text-muted)' }}>
                                                        <i className="fa-solid fa-cubes fs-1 mb-3 d-block opacity-50"></i>
                                                        Trang này chưa có Block nào. Hãy thêm block đầu tiên!
                                                    </td>
                                                </tr>
                                            )}
                                            {provided.placeholder}
                                        </tbody>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Thêm Block Mới - Giao diện WOW */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050,
                    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    
                    <div 
                        className="shadow-lg position-relative wow-modal-bg" 
                        style={{ 
                            width: '460px', maxWidth: '90%', 
                            borderRadius: '24px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--brand-purple, #8b5cf6)', filter: 'blur(70px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
                        
                        <div className="p-4 p-md-5 position-relative z-1">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="m-0 fs-4 fw-bold" style={{ background: 'var(--brand-gradient, linear-gradient(to right, #8b5cf6, #3b82f6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    <i className="fa-solid fa-cube me-2 text-primary" style={{ WebkitTextFillColor: 'initial' }}></i> 
                                    Thêm Block Mới
                                </h3>
                                <button 
                                    onClick={() => setShowAddModal(false)} 
                                    className="btn btn-sm d-flex align-items-center justify-content-center wow-close-btn" 
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none' }}
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddBlock}>
                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 small text-uppercase letter-spacing-1 wow-text-muted-custom">Tên gợi nhớ (Title)</label>
                                    <input 
                                        type="text" 
                                        className="form-control wow-glass-input px-3 py-2"
                                        placeholder="Ví dụ: Banner trang chủ"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.title && <div className="text-danger mt-1 small"><i className="fa-solid fa-circle-exclamation me-1"></i> {errors.title}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="fw-semibold mb-2 small text-uppercase letter-spacing-1 wow-text-muted-custom">Loại Block (Type)</label>
                                    
                                    {showDropdown && (
                                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }} onClick={() => setShowDropdown(false)}></div>
                                    )}

                                    <div className="position-relative" style={{ zIndex: 1050 }}>
                                        <div 
                                            className="wow-glass-input px-3 py-2 d-flex align-items-center justify-content-between"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            <span className="fw-medium">{blockTypes[data.type]?.name || 'Chọn loại Block...'}</span>
                                            <i className={`fa-solid fa-chevron-down wow-text-muted-custom transition-transform ${showDropdown ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}></i>
                                        </div>
                                        
                                        {showDropdown && (
                                            <div 
                                                className="position-absolute w-100 mt-2 wow-modal-bg"
                                                style={{ 
                                                    borderRadius: '16px', boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.3)',
                                                    display: 'flex', flexDirection: 'column',
                                                    maxHeight: '400px', zIndex: 1060,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div className="p-2 border-bottom wow-border-custom">
                                                    <div className="position-relative">
                                                        <i className="fa-solid fa-search position-absolute wow-text-muted-custom" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}></i>
                                                        <input 
                                                            type="text" 
                                                            className="form-control wow-glass-input form-control-sm ps-5 border-0"
                                                            placeholder="Tìm kiếm block..."
                                                            value={searchQuery}
                                                            onChange={e => setSearchQuery(e.target.value)}
                                                            onClick={e => e.stopPropagation()}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-2 custom-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
                                                    {Object.entries(blockTypes).filter(([key, item]) => 
                                                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                        key.toLowerCase().includes(searchQuery.toLowerCase())
                                                    ).length > 0 ? (
                                                        Object.entries(blockTypes).filter(([key, item]) => 
                                                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                            key.toLowerCase().includes(searchQuery.toLowerCase())
                                                        ).map(([key, item]) => (
                                                            <button
                                                                key={key}
                                                                type="button"
                                                                className={`wow-glass-item ${data.type === key ? 'active' : ''}`}
                                                                onClick={() => {
                                                                    setData('type', key);
                                                                    setShowDropdown(false);
                                                                    setSearchQuery('');
                                                                }}
                                                            >
                                                                {item.name}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="p-3 text-center wow-text-muted-custom small">Không tìm thấy block phù hợp</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.type && <div className="text-danger mt-1 small"><i className="fa-solid fa-circle-exclamation me-1"></i> {errors.type}</div>}
                                </div>
                                
                                <div className="d-flex justify-content-end gap-2 mt-5">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="btn px-4 rounded-pill wow-text-muted-custom hover-text-primary" style={{ background: 'transparent' }}>
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className="btn px-4 rounded-pill fw-bold shadow" style={{ background: 'var(--brand-gradient, linear-gradient(to right, #8b5cf6, #3b82f6))', color: '#fff', border: 'none' }} disabled={processing}>
                                        {processing ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-plus me-2"></i>}
                                        {processing ? 'Đang thêm...' : 'Khởi tạo Block'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </CMSLayout>
    );
}
