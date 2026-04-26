package com.nihongo.beginner.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView
import com.nihongo.beginner.LessonJourneyActivity
import com.nihongo.beginner.R
import com.nihongo.beginner.data.Lesson

// ── Path item sealed type ──────────────────────────────────────────────────────

sealed class PathItem {
    data class Header(
        val title: String,
        val emoji: String,
        val subtitle: String,
        val color: Int
    ) : PathItem()

    data class Node(
        val lesson: Lesson,
        val state: NodeState
    ) : PathItem()
}

enum class NodeState { LOCKED, ACTIVE, COMPLETED }

// ── Adapter ───────────────────────────────────────────────────────────────────

class LessonPathAdapter(
    private var items: List<PathItem>
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        const val TYPE_HEADER = 0
        const val TYPE_NODE = 1

        private val UNITS = listOf(
            Triple("פתיחה", "🌸", 1..4),
            Triple("דקדוק בסיסי", "📖", 5..8),
            Triple("פעלים", "✍️", 9..13),
            Triple("מתקדם", "🏆", 14..17),
            Triple("למטיילים", "🗾", 18..23)
        )

        private val UNIT_COLORS = listOf(
            0xFFC0362A.toInt(),
            0xFF0EA5E9.toInt(),
            0xFFF59E0B.toInt(),
            0xFF8B5CF6.toInt(),
            0xFF16A34A.toInt()
        )

        fun buildPathItems(lessons: List<Lesson>, completedIds: Set<Int>): List<PathItem> {
            val items = mutableListOf<PathItem>()
            UNITS.forEachIndexed { unitIndex, (title, emoji, range) ->
                val unitLessons = lessons.filter { it.id in range }
                val completedInUnit = unitLessons.count { it.id in completedIds }
                items.add(
                    PathItem.Header(
                        title = title,
                        emoji = emoji,
                        subtitle = "$completedInUnit / ${unitLessons.size} שיעורים",
                        color = UNIT_COLORS[unitIndex]
                    )
                )
                unitLessons.forEach { lesson ->
                    val state = when {
                        lesson.id in completedIds -> NodeState.COMPLETED
                        else -> NodeState.ACTIVE
                    }
                    items.add(PathItem.Node(lesson, state))
                }
            }
            return items
        }
    }

    // ── dp helper ─────────────────────────────────────────────────────────────

    private fun Float.dpToPx(context: Context): Float =
        this * context.resources.displayMetrics.density

    // ── ViewHolders ───────────────────────────────────────────────────────────

    inner class HeaderViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: MaterialCardView = itemView as MaterialCardView
        val tvEmoji: TextView = itemView.findViewById(R.id.tvUnitEmoji)
        val tvTitle: TextView = itemView.findViewById(R.id.tvUnitTitle)
        val tvSubtitle: TextView = itemView.findViewById(R.id.tvUnitSubtitle)
    }

    inner class NodeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nodeRoot: LinearLayout = itemView.findViewById(R.id.nodeRoot)
        val flNodeCircle: FrameLayout = itemView.findViewById(R.id.flNodeCircle)
        val tvNodeEmoji: TextView = itemView.findViewById(R.id.tvNodeEmoji)
        val tvNodeTitle: TextView = itemView.findViewById(R.id.tvNodeTitle)
        val tvNodeNumber: TextView = itemView.findViewById(R.id.tvNodeNumber)
        val ivNodeIcon: ImageView = itemView.findViewById(R.id.ivNodeIcon)
        val vConnectorBottom: View = itemView.findViewById(R.id.vConnectorBottom)
    }

    // ── Adapter overrides ─────────────────────────────────────────────────────

    override fun getItemViewType(position: Int): Int =
        when (items[position]) {
            is PathItem.Header -> TYPE_HEADER
            is PathItem.Node -> TYPE_NODE
        }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            TYPE_HEADER -> HeaderViewHolder(
                inflater.inflate(R.layout.item_unit_header, parent, false)
            )
            else -> NodeViewHolder(
                inflater.inflate(R.layout.item_lesson_node, parent, false)
            )
        }
    }

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (val item = items[position]) {
            is PathItem.Header -> bindHeader(holder as HeaderViewHolder, item)
            is PathItem.Node -> bindNode(holder as NodeViewHolder, item, position)
        }
    }

    private fun bindHeader(holder: HeaderViewHolder, item: PathItem.Header) {
        holder.cardView.setCardBackgroundColor(item.color)
        holder.tvEmoji.text = item.emoji
        holder.tvTitle.text = item.title
        holder.tvSubtitle.text = item.subtitle
    }

    private fun bindNode(holder: NodeViewHolder, item: PathItem.Node, position: Int) {
        val context = holder.itemView.context
        val lesson = item.lesson

        // Circle background by state
        val circleDrawable = when (item.state) {
            NodeState.COMPLETED -> R.drawable.bg_node_completed
            NodeState.ACTIVE -> R.drawable.bg_node_active
            NodeState.LOCKED -> R.drawable.bg_node_locked
        }
        holder.flNodeCircle.setBackgroundResource(circleDrawable)

        // Texts
        holder.tvNodeEmoji.text = lesson.emoji
        holder.tvNodeTitle.text = lesson.title
        holder.tvNodeNumber.text = lesson.number

        // Badge icon
        if (item.state == NodeState.COMPLETED) {
            holder.ivNodeIcon.visibility = View.VISIBLE
            holder.ivNodeIcon.setImageResource(R.drawable.ic_completed_badge)
        } else {
            holder.ivNodeIcon.visibility = View.GONE
        }

        // Connector bottom: hide for last item in list
        holder.vConnectorBottom.visibility =
            if (position == items.size - 1) View.INVISIBLE else View.VISIBLE

        // Zigzag offset: alternate left/right
        // Count only NODE items up to this position for parity
        val nodeIndex = items.take(position + 1).count { it is PathItem.Node } - 1
        val offsetPx = 60f.dpToPx(context)
        holder.nodeRoot.translationX = if (nodeIndex % 2 == 0) -offsetPx else offsetPx

        // Click handler
        holder.nodeRoot.setOnClickListener {
            val intent = Intent(context, LessonJourneyActivity::class.java)
            intent.putExtra("lesson_id", lesson.id)
            context.startActivity(intent)
        }
    }

    // ── Public update method ──────────────────────────────────────────────────

    fun updateItems(newItems: List<PathItem>) {
        items = newItems
        notifyDataSetChanged()
    }
}
