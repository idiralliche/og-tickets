from rest_framework.routers import DefaultRouter
from .views import CartViewSet, CartItemViewSet

router = DefaultRouter()
# /api/cart/ and /api/cart/<pk>/
router.register(r'', CartViewSet, basename='cart')

# /api/cart/items/ and /api/cart/items/<pk>/
router.register(r'items', CartItemViewSet, basename='cart-item')

urlpatterns = router.urls
